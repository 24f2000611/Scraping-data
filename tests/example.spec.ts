const { test, expect } = require('@playwright/test');

test('Scrape all table sums - FIXED', async ({ page }) => {
  console.log('🚀 Starting SAFE table scraping...');
  
  const urls = [
    'https://sanand0.github.io/tdsdata/js_table/?seed=49',
    'https://sanand0.github.io/tdsdata/js_table/?seed=50',
    'https://sanand0.github.io/tdsdata/js_table/?seed=51',
    'https://sanand0.github.io/tdsdata/js_table/?seed=52',
    'https://sanand0.github.io/tdsdata/js_table/?seed=53',
    'https://sanand0.github.io/tdsdata/js_table/?seed=54',
    'https://sanand0.github.io/tdsdata/js_table/?seed=55',
    'https://sanand0.github.io/tdsdata/js_table/?seed=56',
    'https://sanand0.github.io/tdsdata/js_table/?seed=57',
    'https://sanand0.github.io/tdsdata/js_table/?seed=58'
  ];

  let grandTotal = 0;
  
  for (let i = 0; i < urls.length; i++) {
    const seed = 49 + i;
    console.log(`📄 Processing seed ${seed}`);
    
    try {
      await page.goto(urls[i], { waitUntil: 'networkidle' });
      await page.waitForSelector('table', { timeout: 10000 });
      
      // TARGET ONLY TABLE CELLS - no body text junk!
      const cells = await page.$$eval('table td, table th', elements => 
        elements.map(el => el.textContent.trim()).filter(text => text)
      );
      
      // SUPER SAFE number parsing
      let pageSum = 0;
      let validCount = 0;
      
      for (let cell of cells) {
        const num = parseFloat(cell);
        if (!isNaN(num) && isFinite(num)) {
          pageSum += num;
          validCount++;
        }
      }
      
      console.log(`✅ Seed ${seed}: ${pageSum.toFixed(2)} (${validCount} valid numbers)`);
      grandTotal += pageSum;
      
    } catch (error) {
      console.log(`❌ Seed ${seed} failed: ${error.message}`);
    }
  }
  
  console.log('');
  console.log('🎯 GRAND TOTAL SUM OF ALL NUMBERS ACROSS ALL TABLES: ' + grandTotal.toFixed(2));
  console.log('✅ SCRAPING COMPLETE - NO INFINITY!');
});
