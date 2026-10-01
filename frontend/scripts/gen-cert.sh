#!/usr/bin/env sh
# Membuat CA lokal + sertifikat HTTPS untuk dev server (`npm run dev:https`)
# supaya browser tidak menampilkan "Not secure" saat dibuka lewat IP WiFi.
#
# Jalankan dari Git Bash:  sh scripts/gen-cert.sh [IP ...]
# Tanpa argumen, semua IPv4 lokal perangkat ini dipakai otomatis.
# Jalankan ulang kalau IP WiFi berubah — CA yang sudah dipercaya tetap dipakai.
#
# CA dibatasi (nameConstraints) hanya untuk localhost & IP jaringan lokal,
# jadi tidak bisa dipakai memalsukan situs publik walaupun kuncinya bocor.
# JANGAN bagikan / commit .cert/rootCA.key.
set -e
export MSYS_NO_PATHCONV=1 # Git Bash: jangan ubah "/CN=..." menjadi path Windows

cd "$(dirname "$0")/.."
DIR=.cert
mkdir -p "$DIR"

IPS="$*"
if [ -z "$IPS" ]; then
  IPS=$(node -e "const o=require('os').networkInterfaces();console.log(Object.values(o).flat().filter(i=>i.family==='IPv4'&&!i.internal).map(i=>i.address).join(' '))")
fi

if [ ! -f "$DIR/rootCA.key" ]; then
  echo "→ Membuat CA lokal baru"
  cat > "$DIR/ca.cnf" <<'EOF'
[req]
distinguished_name = dn
x509_extensions = v3_ca
prompt = no
[dn]
CN = Si Iklim Muda Dev CA
O = Si Iklim Muda (development only)
[v3_ca]
basicConstraints = critical, CA:TRUE, pathlen:0
keyUsage = critical, keyCertSign, cRLSign
subjectKeyIdentifier = hash
nameConstraints = critical, permitted;DNS:localhost, permitted;IP:127.0.0.0/255.0.0.0, permitted;IP:10.0.0.0/255.0.0.0, permitted;IP:172.16.0.0/255.240.0.0, permitted;IP:192.168.0.0/255.255.0.0
EOF
  openssl ecparam -name prime256v1 -genkey -noout -out "$DIR/rootCA.key"
  openssl req -x509 -new -key "$DIR/rootCA.key" -config "$DIR/ca.cnf" -sha256 -days 3650 -out "$DIR/rootCA.crt"
  rm "$DIR/ca.cnf"
fi

SAN="DNS:localhost,IP:127.0.0.1"
for ip in $IPS; do SAN="$SAN,IP:$ip"; done
echo "→ Sertifikat untuk: $SAN"

cat > "$DIR/leaf.ext" <<EOF
basicConstraints = CA:FALSE
keyUsage = critical, digitalSignature
extendedKeyUsage = serverAuth
subjectAltName = $SAN
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid
EOF

openssl ecparam -name prime256v1 -genkey -noout -out "$DIR/key.pem"
openssl req -new -key "$DIR/key.pem" -subj "/CN=Si Iklim Muda Dev" -out "$DIR/leaf.csr"
# 397 hari: batas maksimal yang diterima iOS/Chrome untuk sertifikat server
openssl x509 -req -in "$DIR/leaf.csr" -CA "$DIR/rootCA.crt" -CAkey "$DIR/rootCA.key" -CAcreateserial \
  -days 397 -sha256 -extfile "$DIR/leaf.ext" -out "$DIR/cert.pem"
rm "$DIR/leaf.csr" "$DIR/leaf.ext"

echo "✓ Selesai. CA: $DIR/rootCA.crt — pasang sebagai tepercaya di laptop & HP (lihat README)."
