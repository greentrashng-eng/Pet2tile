-- Pet2tile evidence storage setup
-- The bucket must be private.

insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do update set public = false;

-- Evidence files should normally be stored under a user's UUID folder:
-- evidence/<user-uuid>/<filename>

drop policy if exists "Pet2tile authenticated users can upload evidence" on storage.objects;
drop policy if exists "Pet2tile authenticated users can view evidence" on storage.objects;
drop policy if exists "Pet2tile authenticated users can update evidence" on storage.objects;
drop policy if exists "Pet2tile authenticated users can delete evidence" on storage.objects;

create policy "Pet2tile authenticated users can upload evidence"
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'evidence'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.user_is_staff()
  )
);

create policy "Pet2tile authenticated users can view evidence"
on storage.objects
for select to authenticated
using (
  bucket_id = 'evidence'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.user_is_staff()
  )
);

create policy "Pet2tile authenticated users can update evidence"
on storage.objects
for update to authenticated
using (
  bucket_id = 'evidence'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.user_is_staff()
  )
)
with check (
  bucket_id = 'evidence'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.user_is_staff()
  )
);

create policy "Pet2tile authenticated users can delete evidence"
on storage.objects
for delete to authenticated
using (
  bucket_id = 'evidence'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.user_is_staff()
  )
);

