import fs from 'fs';
import path from 'path';

// Resolve paths
const DIR = process.cwd();
const CONFIG_PATH = path.join(DIR, 'config.json');
const TEMPLATE_PATH = path.join(DIR, 'signature.template.html');
const OUTPUT_PATH = path.join(DIR, 'index.html');

// Read config
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

// UI Toggles dynamically pulled from config if we want, or hardcoded for now
const UI_TOGGLES = [
  { id: 'sig-phone-cell', label: 'Cell Phone' },
  { id: 'sig-phone-line1', label: 'Line 1' },
  { id: 'sig-phone-line2', label: 'Emergency 24/7' },
  { id: 'sig-phone-fax', label: 'Fax Line' }
];

function appendUTM(url, brandId) {
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', 'email_signature');
      u.searchParams.set('utm_medium', 'email');
      u.searchParams.set('utm_campaign', brandId);
    }
    return u.toString();
  } catch (e) {
    return url;
  }
}

function generateUIPanel(brands) {
  return `
  <div class="customization-panel" style="background: #1e293b; border-radius: 8px; padding: 15px 20px; margin-bottom: 20px; color: #f8fafc;">
    <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 15px; color: #38bdf8;">⚙️ Signature Customization</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; margin-bottom: 20px;">
      ${UI_TOGGLES.map(t => `<label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" data-target="${t.id}" onchange="toggleElement('${t.id}', this.checked)" style="accent-color: #38bdf8;"> ${t.label}</label>`).join('\n      ')}
    </div>
  </div>`;
}

function generateSignatureHTML(brand, index) {
  const isActive = index === 0 ? 'active' : '';
  
  // Preset classes
  const presetClasses = ['sig-phone-cell', 'sig-phone-line1', 'sig-phone-line2', 'sig-phone-fax']; 

  const logosHtml = brand.logos.map(logo => {
    let style = `display: block; margin: ${logo.margin || '0 auto'};`;
    if (logo.radius) style += ` border-radius: ${logo.radius};`;
    if (logo.border) style += ` border: ${logo.border};`;
    if (logo.opacity) style += ` opacity: ${logo.opacity};`;
    return `<img src="${logo.src}" alt="${brand.name} Logo" width="${logo.width}" ${logo.height ? `height="${logo.height}"` : ''} style="${style}" />`;
  }).join('\n            ');

  const websitesHtml = (brand.websites || []).map(site => 
    `<strong style="color: #0f172a;">${site.label}</strong> <a href="${appendUTM(site.url, brand.id)}" style="color: #3b82f6; text-decoration: none;">${site.text}</a>`
  ).join(' &nbsp;&nbsp;|&nbsp;&nbsp;\n              ');

  const phonesHtml = (brand.phones || []).map(phone => 
    `<span class="${phone.id} ${!presetClasses.includes(phone.id) ? 'is-hidden' : ''}"><strong style="color: #0f172a;">${phone.label}:</strong> <a href="tel:${phone.number.replace(/-/g, '')}" style="color: inherit; text-decoration: none;">${phone.number}</a><br></span>`
  ).join('\n              ');

  const presetJson = JSON.stringify(presetClasses);

  return `
    <div id="sig-${brand.id}" class="signature-wrapper ${isActive}" data-preset='${presetJson}'>
      <!--[if mso]>
      <table cellpadding="0" cellspacing="0" border="0" width="600" style="width: 600px;"><tr><td>
      <![endif]-->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; line-height: 1.4; font-size: 13px; color: #1e293b; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
        <tr>
          <!-- Logo Cell -->
          <td valign="top" align="center" width="130" style="width: 130px; min-width: 130px; padding-right: 20px; border-right: 2px solid #facc15;">
            ${logosHtml}
          </td>
          
          <!-- Content Cell -->
          <td valign="top" style="padding-left: 20px; color: #1e293b;">
            <h3 style="margin: 0 0 2px 0; font-size: 18px; font-weight: 700; color: #0f172a;">${brand.name}</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #3b82f6;">${brand.title}${brand.subtitle ? `<br>${brand.subtitle}` : ''}</p>
            
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #334155;">
              ${brand.address}
            </p>

            <p style="margin: 0 0 10px 0; font-size: 12px; color: #334155; line-height: 1.6;">
              ${phonesHtml}
            </p>

            <p style="margin: 0 0 12px 0; font-size: 12px; color: #334155;">
              ${websitesHtml}
            </p>

            <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; max-width: 100%;">
              <p style="margin: 0 0 4px 0; font-size: 12px; line-height: 1.4; color: #475569;">
                ${brand.vision}
              </p>
            </div>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </div>`;
}

let template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

const uiPanelHtml = generateUIPanel(config.brands);
let signaturesHtml = config.brands.map((brand, index) => generateSignatureHTML(brand, index)).join('\n');

signaturesHtml = signaturesHtml.replace(/>\s+</g, '><');

template = template.replace('<!-- INJECT:UI_PANEL -->', uiPanelHtml);
template = template.replace('<!-- INJECT:SIGNATURES -->', signaturesHtml);

fs.writeFileSync(OUTPUT_PATH, template);
console.log('Successfully compiled index.html!');
