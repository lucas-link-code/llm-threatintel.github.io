# Threat Actor Tracker Fix - Deployment Guide

## Changes Summary

Fixed three critical issues with the Threat Actor Tracker page:

1. **Front-end state management**: Added interactive filtering, actor selection, and detail panel
2. **Backend enrichment**: Collection script now updates existing actor descriptions with better content
3. **Data cleanup**: Removed citation markers from actor data

## Files Modified

- `js/app.js`: Added state fields, helper methods, and completely rewrote renderActors function
- `css/style.css`: Added CSS for active filters, detail panel, and row selection
- `scripts/collect.py`: Added pick_better_text helper and enhanced actor merge logic
- `data/actors.json`: Removed citation markers from UNC1069 and WAVESHAPER.V2

## Deployment Steps

### 1. Deploy Code Changes

Push the changes to the repository:

```bash
git add -A
git commit -m "Fix threat actor tracker: add filtering, selection, and data enrichment"
git push origin main
```

### 2. Verify GitHub Actions

Wait for the deploy.yml workflow to complete. Check that the site builds successfully.

### 3. Purge Cloudflare Cache

After deployment, purge the Cloudflare cache for these specific paths:

- `/`
- `/js/app.js`
- `/css/style.css`
- `/data/actors.json`

In Cloudflare dashboard:
1. Go to Caching > Configuration
2. Click "Purge Cache"
3. Select "Custom Purge"
4. Enter the URLs above

### 4. Optional: Version Assets

If cache issues persist, add version query strings to index.html:

```html
<link rel="stylesheet" href="css/style.css?v=20260404">
<script src="js/app.js?v=20260404"></script>
```

### 5. Test on Multiple Browsers

After cache purge, test on:

- Desktop Chrome/Firefox (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
- Mobile Safari (clear cache, or private browsing)
- Verify all four filter tiles work correctly
- Verify clicking actor rows updates the detail panel
- Verify search box filters without breaking selection

## Expected Behavior

After deployment:

- Clicking "Malicious Tools" tile filters to only malicious LLM tools
- Clicking "Malware" tile filters to malware and supply chain campaigns
- Clicking "Threat Groups" tile filters to nation-state and APT groups
- Clicking any actor row updates the large detail panel above the table
- Every actor row displays a descriptive summary beneath the name
- Search box filters actors in real-time
- No citation markers visible in any actor descriptions

## Collection Script Changes

The next time `scripts/collect.py` runs:

- Existing actors will have their descriptions enriched if new intel provides better content
- Status, type, first_seen, and attribution fields will be updated intelligently
- All citation markers will be automatically stripped before saving
- The longer of two descriptions will be preferred when merging

## Rollback Plan

If issues occur, revert with:

```bash
git revert HEAD
git push origin main
```

Then purge Cloudflare cache again.

## Testing Checklist

- [ ] All four filter tiles change the visible actor list
- [ ] Clicking different actor rows changes the detail panel
- [ ] Search box filters actors without breaking selection
- [ ] Mobile layout does not break with new detail panel
- [ ] No citation markers appear in actor descriptions or attributions
- [ ] Python collection script runs without errors: `python scripts/collect.py --dry-run`
