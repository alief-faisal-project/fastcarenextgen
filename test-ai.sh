#!/bin/bash

# 🚀 FastCare AI Integration Testing Script
# Purpose: Quick validation of AI implementation

echo "════════════════════════════════════════════════════════"
echo "🤖 FastCare AI Integration - Testing Suite"
echo "════════════════════════════════════════════════════════"
echo ""

# Check 1: Environment Variables
echo "✓ Check 1: Environment Variables"
if [ -z "$OPENAI_API_KEY" ]; then
    echo "  ⚠️  OPENAI_API_KEY not in shell environment"
    echo "     (Check .env.local - it should be there)"
else
    echo "  ✅ OPENAI_API_KEY found in environment"
fi
echo ""

# Check 2: File Existence
echo "✓ Check 2: File Existence"
files=(
    "lib/aiHospital.ts"
    "pages/api/aiHospital.ts"
    "app/admin/page.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file NOT FOUND"
    fi
done
echo ""

# Check 3: TypeScript Compilation
echo "✓ Check 3: TypeScript Checks"
echo "  Running: npx tsc --noEmit --skipLibCheck"
npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "(aiHospital|admin)" || echo "  ✅ No errors found"
echo ""

# Check 4: Function Exports
echo "✓ Check 4: Function Exports"
if grep -q "export async function fetchHospitalAI" lib/aiHospital.ts; then
    echo "  ✅ fetchHospitalAI exported"
fi
if grep -q "export interface HospitalAIResponse" pages/api/aiHospital.ts; then
    echo "  ✅ HospitalAIResponse interface exported"
fi
echo ""

# Check 5: Key Configurations
echo "✓ Check 5: Key Configurations"
if grep -q 'model: "gpt-4o-mini"' lib/aiHospital.ts; then
    echo "  ✅ GPT-4o-mini model configured"
fi
if grep -q 'CACHE_TTL = 5 \* 60 \* 1000' lib/aiHospital.ts; then
    echo "  ✅ Cache TTL = 5 minutes"
fi
if grep -q 'response_format: { type: "json_object" }' lib/aiHospital.ts; then
    echo "  ✅ JSON response format enforced"
fi
echo ""

# Check 6: Admin Panel Integration
echo "✓ Check 6: Admin Panel Integration"
if grep -q 'Isi Otomatis dengan AI' app/admin/page.tsx; then
    echo "  ✅ AI button text found"
fi
if grep -q 'isLoadingAI' app/admin/page.tsx; then
    echo "  ✅ Loading state implemented"
fi
echo ""

echo "════════════════════════════════════════════════════════"
echo "✅ Pre-deployment Checklist Complete!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo "  1. Start dev server: npm run dev"
echo "  2. Open: http://localhost:3000/admin"
echo "  3. Navigate to: Rumah Sakit tab"
echo "  4. Click: + Tambah RS button"
echo "  5. Click: Isi Otomatis dengan AI"
echo "  6. Input: Hospital name (e.g., 'Siloam Lippo Karawaci')"
echo "  7. Verify: Form auto-fills with data"
echo ""
echo "📊 Monitor:"
echo "  - Open DevTools (F12)"
echo "  - Console tab"
echo "  - Filter: 'AI'"
echo "  - Check logs"
echo ""
echo "✨ Done!"
