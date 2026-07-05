# Kubernetes Manifest

Manifest ini disiapkan untuk deploy aplikasi `clever-web` ke Kubernetes.

## Isi folder

- `namespace.yaml`: namespace aplikasi
- `secret.example.yaml`: template secret dan konfigurasi yang perlu diisi
- `deployment.yaml`: deployment aplikasi Next.js
- `service.yaml`: service internal cluster
- `ingress.yaml`: ingress publik
- `kustomization.yaml`: bundle untuk `kubectl apply -k`

## Hal yang perlu diganti

1. Ganti `your-registry/clever-web:latest` di `deployment.yaml` dengan image aplikasi yang valid.
2. Ganti host `clevermom.example.com` di `ingress.yaml` dengan domain production.
3. Salin `secret.example.yaml` menjadi `secret.yaml` dan isi semua nilai variabel di dalamnya (kredensial sensitif dan konfigurasi umum).
4. Jika namespace berbeda, sesuaikan `namespace.yaml` dan referensinya.

## Apply

```bash
kubectl apply -f k8s/secret.example.yaml
kubectl apply -k k8s
```

## Catatan

- Probe memakai endpoint `GET /api/healthz`.
- `NEXTAUTH_URL` harus sama dengan domain yang dipakai user untuk akses aplikasi.
- Pastikan OAuth redirect URI Google juga memakai domain production:
  `https://your-domain/api/auth/callback/google`
- Sebaiknya copy `secret.example.yaml` menjadi file secret environment-specific sebelum apply.
- Jangan commit nilai asli `BLOGGER_BLOG_ID`, `APPS_SCRIPT_URL`, atau secret lain. Netlify akan menggagalkan build jika nilai environment variable ditemukan di file repo atau build output.
