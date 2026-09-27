#!/usr/bin/env bash
set -euo pipefail

PROJECT_URL="https://tfsbcnmakaomboshrfho.supabase.co"
PUBLISHABLE_KEY="sb_publishable_-hCAsTK9tRsprcMqL2tI7Q_XF73LNVE"

read -rsp "Paste the NEW rotated Supabase secret key: " SUPABASE_SECRET_KEY
printf "\n"

if [[ -z "$SUPABASE_SECRET_KEY" ]]; then
  echo "Supabase secret key is required." >&2
  exit 1
fi

read -rsp "Telegram BotFather token (press Enter to configure later): " TELEGRAM_BOT_TOKEN
printf "\n"

if command -v openssl >/dev/null 2>&1; then
  WEBHOOK_SETUP_SECRET="$(openssl rand -hex 32)"
else
  WEBHOOK_SETUP_SECRET="$(python3 - <<'PY2'
import secrets
print(secrets.token_hex(32))
PY2
)"
fi

cat > .env.local <<EOF
NEXT_PUBLIC_SUPABASE_URL=$PROJECT_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY
SUPABASE_URL=$PROJECT_URL
SUPABASE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=$SUPABASE_SECRET_KEY
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
APP_URL=http://localhost:3000
WEBHOOK_SETUP_SECRET=$WEBHOOK_SETUP_SECRET
EOF

chmod 600 .env.local
echo "Created .env.local for Supabase project tfsbcnmakaomboshrfho."
echo "The file is ignored by Git and must never be committed."
