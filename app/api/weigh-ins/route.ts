import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: price, error: priceError } = await supabase
      .from('material_prices')
      .select('buy_price')
      .eq('material_type', body.material_type)
      .eq('is_active', true)
      .order('effective_from', { ascending: false })
      .limit(1)
      .single()

    if (priceError || !price) {
      return NextResponse.json(
        { error: 'No active price' },
        { status: 400 }
      )
    }

    const weight = Number(body.weight_kg)

    if (!weight || weight <= 0) {
      return NextResponse.json(
        { error: 'Invalid weight' },
        { status: 400 }
      )
    }

    const payout =
      weight * Number(price.buy_price)

    const { data, error } = await supabase
      .from('weigh_ins')
      .insert({
        reference: `PET-OWE-${Date.now()}`,
        collector_id: body.collector_id,
        centre_id: body.centre_id,
        material_type: body.material_type,
        gross_weight_kg: weight,
        verified_weight_kg: weight,
        buy_price_per_kg: price.buy_price,
        payout_amount: payout,
        status: 'pending',
        payment_method: body.payment_method,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data,
      payout,
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
