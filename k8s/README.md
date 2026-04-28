# Kubernetes Manifest

Manifest ini disiapkan untuk deploy aplikasi `clever-web` ke Kubernetes.

## Isi folder

- `namespace.yaml`: namespace aplikasi
- `configmap.yaml`: konfigurasi non-secret
- `secret.example.yaml`: template secret yang perlu diisi
- `deployment.yaml`: deployment aplikasi Next.js
- `service.yaml`: service internal cluster
- `ingress.yaml`: ingress publik
- `kustomization.yaml`: bundle untuk `kubectl apply -k`

## Hal yang perlu diganti

1. Ganti `your-registry/clever-web:latest` di `deployment.yaml` dengan image aplikasi yang valid.
2. Ganti host `clevermom.example.com` di `ingress.yaml` dan `NEXTAUTH_URL` di `configmap.yaml` dengan domain production.
3. Isi semua nilai placeholder di `secret.example.yaml`.
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
