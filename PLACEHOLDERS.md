# PLACEHOLDERS TO REPLACE BEFORE DEPLOYMENT

This document lists all placeholder values that need to be replaced with actual values before deploying to production.

## 1. Buy Me a Coffee URL

### Placeholder String
```
PLACEHOLDER_BMC_URL
```

### Locations
- `index.html` - Line 48
- `js/app.js` - Lines 437 and 439

### How to Replace
1. Create your Buy Me a Coffee account at https://buymeacoffee.com/
2. Note your public page URL (format: https://buymeacoffee.com/yourname)
3. Use search and replace to update all instances:

```bash
# macOS/Linux
grep -r "PLACEHOLDER_BMC_URL" index.html js/app.js

# Replace using sed (backup originals first)
sed -i.bak 's|PLACEHOLDER_BMC_URL|https://buymeacoffee.com/yourname|g' index.html
sed -i.bak 's|PLACEHOLDER_BMC_URL|https://buymeacoffee.com/yourname|g' js/app.js
```

Or manually edit each file and replace the placeholder.

## 2. Contact Email Address

### Placeholder String
```
PLACEHOLDER_CONTACT_EMAIL
```

### Locations
- `js/app.js` - Line 440 (appears twice: in href and in visible text)

### How to Replace
Decide on your contact email and replace both instances. Recommended options:
- support@llm-threatintel.com
- research@llm-threatintel.com
- contact@llm-threatintel.com

```bash
# Check current usage
grep -n "PLACEHOLDER_CONTACT_EMAIL" js/app.js

# Replace using sed (backup original first)
sed -i.bak 's|PLACEHOLDER_CONTACT_EMAIL|support@llm-threatintel.com|g' js/app.js
```

## 3. Homepage Social Preview Image

### Missing File
```
assets/og/llm-threatintel-home.png
```

### Specifications
- Size: 1200 x 630 pixels
- Format: PNG
- Background: Dark/purple to match site theme
- Content:
  - Large readable text: "LLM ThreatIntel"
  - Subtitle: "GenAI Threat Intelligence"
  - Optional: "Malicious LLM tools • AI malware • LLMjacking • Shadow AI"

### How to Create
1. Design in your preferred tool (Figma, Canva, Photoshop, etc.)
2. Export as PNG at exactly 1200x630
3. Save to: `assets/og/llm-threatintel-home.png`
4. Commit and push

### Quick Alternative
Until you create a custom image, you can use a temporary text-based image or skip this step. The site will function normally, but social previews will reference a broken image URL.

---

## Quick Check Script

Run this to verify all placeholders are replaced:

```bash
cd /Users/lukaszlinkowski/Downloads/llm-threatintel

echo "=== Checking for remaining placeholders ==="
echo ""

echo "Buy Me a Coffee URLs:"
grep -n "PLACEHOLDER_BMC_URL" index.html js/app.js || echo "✓ All BMC URLs replaced"
echo ""

echo "Contact Emails:"
grep -n "PLACEHOLDER_CONTACT_EMAIL" js/app.js || echo "✓ All contact emails replaced"
echo ""

echo "Homepage OG Image:"
if [ -f "assets/og/llm-threatintel-home.png" ]; then
    echo "✓ Homepage OG image exists"
    ls -lh assets/og/llm-threatintel-home.png
else
    echo "✗ Missing: assets/og/llm-threatintel-home.png"
fi
echo ""

echo "=== Summary ==="
if ! grep -q "PLACEHOLDER" index.html js/app.js && [ -f "assets/og/llm-threatintel-home.png" ]; then
    echo "✓ All placeholders resolved - ready for deployment"
else
    echo "✗ Some placeholders remain - see above"
fi
```

---

## After Replacing Placeholders

1. Test locally if possible
2. Commit changes with descriptive message:
   ```bash
   git add index.html js/app.js assets/og/llm-threatintel-home.png
   git commit -m "Replace placeholders with actual support links and OG image"
   git push origin main
   ```
3. Wait for GitHub Actions deployment
4. Validate live site using checklist in IMPLEMENTATION_REPORT.md

---

## Current Status

As of implementation completion:
- [x] Code implemented and tested locally
- [ ] PLACEHOLDER_BMC_URL replaced (2 locations)
- [ ] PLACEHOLDER_CONTACT_EMAIL replaced (2 locations)
- [ ] Homepage OG image created and added
- [ ] Changes committed and pushed
- [ ] Deployed to GitHub Pages
- [ ] Live site validated
