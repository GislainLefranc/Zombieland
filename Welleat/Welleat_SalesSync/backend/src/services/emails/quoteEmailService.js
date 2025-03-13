// Dossier : src/services/emails
// Fichier : quoteEmailService.js
// Service pour l'envoi d'emails de devis

const { sendEmail } = require('../utils/emailConfigService');
const logger = require('../../utils/logger');

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}

function buildQuoteData(quote, profileData) {
  if (!quote || !profileData) {
    throw new Error('Données manquantes pour générer le devis');
  }
  
  const formulaData = quote.formula
    ? {
        name: quote.formula.name || 'N/A',
        installation: Number(quote.installation_price || 0),
        maintenance: Number(quote.maintenance_price || 0),
        hotline: Number(quote.hotline_price || 0),
        options: Array.isArray(quote.formula.options) ? quote.formula.options : [],
      }
    : null;
  
  // Calcul correct des équipements avec gratuité
  const equipmentTotal = (quote.equipments || []).reduce((total, eq) => {
    const unitPrice = Number(eq.QuoteEquipment?.unit_price_ht || eq.price_ht || 0);
    const quantity = Number(eq.QuoteEquipment?.quantity || 0);
    const isFirstUnitFree = Boolean(eq.QuoteEquipment?.is_first_unit_free || false);
    
    // Calcul des quantités facturées avec gestion de la gratuité
    const effectiveQty = isFirstUnitFree && quantity > 0 ? quantity - 1 : quantity;
    const equipmentCost = unitPrice * effectiveQty;
    
    logger.debug(`Équipement ${eq.name}:`, {
      prix: unitPrice,
      quantité: quantity,
      gratuité: isFirstUnitFree,
      facturé: effectiveQty,
      coût: equipmentCost
    });
    
    return total + equipmentCost;
  }, 0);

   // Base mensuelle (maintenance + hotline + options)
   const baseInstallation = quote.installation_included ? Number(quote.installation_price || 0) : 0;
   const baseMaintenance = quote.maintenance_included ? Number(quote.maintenance_price || 0) : 0;
   const baseHotline = quote.hotline_included ? Number(quote.hotline_price || 0) : 0;
   const optionsSum = (formulaData?.options || []).reduce((sum, opt) => 
     sum + Number(opt.price_ht || 0), 0);
 
   // Calcul des coûts récurrents
const recurringFormulaCost = baseMaintenance + baseHotline + optionsSum;
const totalRecurring = recurringFormulaCost + equipmentTotal;

  // Calcul de la remise
  const discountPercentage = Number(quote.discount_value || 0);
  const discountAmount = totalRecurring * (discountPercentage / 100);
  const finalMonthlyCostHT = totalRecurring - discountAmount;

   // Calcul des totaux
   const taxRate = Number(quote.tax_rate || 20);
   const finalMonthlyCostTTC = parseFloat((finalMonthlyCostHT * (1 + taxRate / 100)).toFixed(2));
   
   // Gestion de l'installation unique
   const firstMonthCostHT = quote.installation_one_time 
     ? finalMonthlyCostHT + baseInstallation 
     : finalMonthlyCostHT;
   
   // Calcul du TTC pour le premier mois
   const firstMonthCostTTC = parseFloat((firstMonthCostHT * (1 + taxRate / 100)).toFixed(2));
 
   const engagementDuration = Number(quote.engagement_duration || 12);
   const totalEngagementHT = (finalMonthlyCostHT * engagementDuration) + 
     (quote.installation_one_time ? baseInstallation : 0);
  
  let baseTotalFormula = recurringFormulaCost;
  let discountAmountFormula = 0;
  let finalTotalFormula = baseTotalFormula;
  if (quote.discount_type && discountPercentage) {
    discountAmountFormula = baseTotalFormula * (discountPercentage / 100);
    finalTotalFormula = baseTotalFormula - discountAmountFormula;
  }
  const totalTTCFormula = parseFloat((finalTotalFormula * (1 + taxRate / 100)).toFixed(2));
  
  return {
    user: {
      lastName: profileData.nom || 'N/A',
      firstName: profileData.prenom || 'N/A',
      email: profileData.email || 'N/A',
      phone: profileData.phone || '',
      position: profileData.position || '',
    },
    interlocutors: (quote.interlocutors || []).map((it) => ({
      lastName: it.lastName || 'N/A',
      firstName: it.firstName || 'N/A',
      email: it.email || 'N/A',
      phone: it.phone || '',
      position: it.position || '',
      isPrimary: Boolean(it.Quotes_Interlocutors?.is_primary),
    })),
    company: {
      name: quote.company?.name || 'N/A',
      address: quote.company?.address || 'N/A',
      postal_code: quote.company?.postalCode || 'N/A',
      city: quote.company?.city || 'N/A',
      phone: quote.company?.phone || '',
      email: quote.company?.email || '',
    },
    engagement: {
      duration: engagementDuration,
      validUntil: quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('fr-FR') : 'N/A',
      discount: discountPercentage,
    },
    totals: {
      equipmentTotal: equipmentTotal,
      formulaTotal: recurringFormulaCost,
      subTotalHT: firstMonthCostHT,
      discountAmount: discountAmount,
      finalHT: firstMonthCostHT - discountAmount,
      taxRate: taxRate,
      tvaAmount: parseFloat((firstMonthCostHT * (taxRate / 100)).toFixed(2)),
      finalTTC: firstMonthCostTTC,
      monthlyHT: finalMonthlyCostHT,
      monthlyTTC: finalMonthlyCostTTC,
      totalEngagementHT: totalEngagementHT,
      totalEngagementTTC: parseFloat((totalEngagementHT * (1 + taxRate / 100)).toFixed(2)),
      firstMonthCostHT: firstMonthCostHT,
      firstMonthCostTTC: firstMonthCostTTC  
    },
    formula: formulaData,
    formulaDetails: formulaData
      ? {
          baseTotal: baseTotalFormula,
          discountType: quote.discount_type || null,
          discountValue: discountPercentage,
          discountAmount: discountAmountFormula,
          finalTotal: finalTotalFormula,
          taxRate: taxRate,
          totalTTC: totalTTCFormula,
        }
      : null,
    equipments: (quote.equipments || []).map(eq => ({
      id: String(eq.id),
      name: eq.name,
      price: Number(eq.QuoteEquipment?.unit_price_ht || eq.price_ht || 0),
      quantity: Number(eq.QuoteEquipment?.quantity || 0),
      isFirstUnitFree: Boolean(eq.QuoteEquipment?.is_first_unit_free || false),
    })),
  };
}

function _generateStyledEmailTemplate(quote, profileData) {
  const qData = buildQuoteData(quote, profileData);
  if (!qData) {
    throw new Error('Impossible de générer les données du devis');
  }
  const currentYear = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Devis Welleat #${quote.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }
    .container { width: 100%; max-width: 800px; margin: 30px auto; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden; }
    .header { background-color: #13674e; padding: 25px; text-align: center; position: relative; border-top-left-radius: 10px; border-top-right-radius: 10px; }
    .header img { max-width: 120px; }
    .enterprise-name { position: absolute; bottom: 5px; right: 25px; font-size: 1.5em; font-weight: 600; color: #fff; }
    .content { padding: 30px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #13674e; border-bottom: 2px solid #13674e; padding-bottom: 8px; margin-bottom: 20px; font-size: 1.5em; }
    .details p { margin: 8px 0; line-height: 1.5; }
    .contact-box, .equipment-box, .option-box { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e0e0e0; }
    ul { list-style-type: disc; padding-left: 25px; margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; color: #13674e; }
    .signature { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-top: 1px solid #e0e0e0; margin-top: 30px; }
    .signature-info { text-align: left; }
    .signature-info p { margin: 3px 0; font-size: 14px; color: #333; }
    .signature-info a { color: #333; text-decoration: none; }
    .signature-logo { text-align: center; }
    .signature-logo img { max-width: 100px; display: block; margin: 0 auto; }
    .footer { background-color: #13674e; padding: 30px 20px; color: #fff; font-size: 14px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; }
    .footer-info-section { margin-bottom: 15px; }
    .footer-info p, .footer-info a { margin: 5px 0; color: #fff; text-decoration: none; }
    .footer-info a:hover { text-decoration: underline; }
    .social-links { margin-top: 15px; text-align: center; font-size: 14px; }
    .social-links a { color: #fff; text-decoration: none; margin: 0 8px; }
    .social-links span.separator { color: #cccccc; }
    .legal-info { margin-top: 15px; font-size: 11px; color: #cccccc; line-height: 1.4; }
    .cgv-link { margin-top: 15px; font-size: 14px; }
    .cgv-link a { color: #fff; text-decoration: underline; }
    @media only screen and (max-width: 600px) {
      .container { margin: 10px; }
      .header img { max-width: 100px; }
      .enterprise-name { position: static; margin-top: 10px; font-size: 1.2em; }
      .content { padding: 20px; }
      .section h2 { font-size: 1.3em; }
      .footer { text-align: center; }
      .signature { flex-direction: column; align-items: center; }
      .signature-info { text-align: center; margin-bottom: 15px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png" alt="Logo Welleat" />
      <div class="enterprise-name">Welleat</div>
    </div>
    <div class="content">
      <p style="font-size: 18px; font-weight: bold; color: #333;">Bonjour,</p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Suite à notre récente conversation concernant nos services, je vous fais parvenir notre proposition détaillée, adaptée à vos besoins.
      </p>
      <div class="section">
        <h2>Devis #${quote.id}</h2>
      </div>
      <div class="section">
        <h2>Destination – Interlocuteurs</h2>
        ${
          qData.interlocutors.length > 0 
            ? qData.interlocutors.map((it) => `
                <div class="contact-box">
                  <p><strong>${it.isPrimary ? 'Interlocuteur principal' : 'Interlocuteur secondaire'}</strong></p>
                  <p><strong>Nom :</strong> ${it.lastName}</p>
                  <p><strong>Prénom :</strong> ${it.firstName}</p>
                  <p><strong>Email :</strong> <a href="mailto:${it.email}" style="color: #13674e; text-decoration: none;">${it.email}</a></p>
                  ${it.phone ? `<p><strong>Téléphone :</strong> <a href="tel:${it.phone}" style="color: #13674e; text-decoration: none;">${it.phone}</a></p>` : ''}
                  ${it.position ? `<p><strong>Poste :</strong> ${it.position}</p>` : ''}
                </div>
              `).join('') 
            : '<p>Aucun interlocuteur.</p>'
        }
      </div>
      <hr />
      <div class="section">
        <h2>Destination – Entreprise</h2>
        <div class="details">
          <p><strong>Nom :</strong> ${qData.company.name}</p>
          <p><strong>Adresse :</strong> ${qData.company.address}</p>
          <p><strong>Code Postal :</strong> ${qData.company.postal_code}</p>
          <p><strong>Ville :</strong> ${qData.company.city}</p>
          ${qData.company.phone ? `<p><strong>Téléphone :</strong> <a href="tel:${qData.company.phone}" style="color: #13674e; text-decoration: none;">${qData.company.phone}</a></p>` : ''}
          ${qData.company.email ? `<p><strong>Email :</strong> <a href="mailto:${qData.company.email}" style="color: #13674e; text-decoration: none;">${qData.company.email}</a></p>` : ''}
        </div>
      </div>
      <hr />
      <div class="section">
        <h2>Engagement</h2>
        <div class="details">
          <p><strong>Durée :</strong> ${qData.engagement.duration} mois</p>
          <p><strong>Validité du devis :</strong> ${qData.engagement.validUntil}</p>
          ${qData.engagement.discount > 0 ? `<p><strong>Remise :</strong> ${qData.engagement.discount} %</p>` : ''}
          <p style="font-size: 0.9rem; font-style: italic; color: #555;">
            La remise s'applique uniquement sur le tarif mensuel récurrent.
          </p>
        </div>
      </div>
      <hr />
      <div class="section">
        <h2>Formule (mensuel)</h2>
        ${
          qData.formula
            ? `
              <p><strong>Nom :</strong> ${qData.formula.name}</p>
              <div class="option-box">
                <p><strong>Éléments de la formule :</strong></p>
                <table>
                  <tr>
                    <th>Élément</th>
                    <th>Prix HT</th>
                  </tr>
                  ${
                    quote.installation_included 
                      ? `<tr>
                           <td>Installation</td>
                           <td>${formatPrice(qData.formula.installation)} ${quote.installation_one_time ? '<span style="font-style: italic; font-size: 0.9rem;">(premier mois uniquement)</span>' : ''}</td>
                         </tr>` 
                      : ''
                  }
                  ${
                    quote.maintenance_included 
                      ? `<tr>
                           <td>Maintenance</td>
                           <td>${formatPrice(qData.formula.maintenance)}</td>
                         </tr>` 
                      : ''
                  }
                  ${
                    quote.hotline_included 
                      ? `<tr>
                           <td>Hotline</td>
                           <td>${formatPrice(qData.formula.hotline)}</td>
                         </tr>` 
                      : ''
                  }
                  ${
                    (qData.formula.options && qData.formula.options.length)
                      ? `<tr>
                           <td>Options (total)</td>
                           <td>${formatPrice(qData.formula.options.reduce((sum, opt) => sum + Number(opt.price_ht || 0), 0))}</td>
                         </tr>` 
                      : ''
                  }
                </table>
              </div>
              <div class="option-box" style="margin-top: 20px;">
                <p><strong>Détails de la formule (tarif récurrent)</strong></p>
                <table>
                  <tr>
                    <th>Élément</th>
                    <th>Montant</th>
                  </tr>
                  <tr>
                    <td>Sous-total Formule HT</td>
                    <td>${formatPrice(qData.formulaDetails.baseTotal)}</td>
                  </tr>
                  ${
                    qData.formulaDetails.discountType
                      ? `<tr>
                           <td>Remise (${qData.formulaDetails.discountType === 'percentage' ? qData.formulaDetails.discountValue + ' %' : formatPrice(qData.formulaDetails.discountValue)})</td>
                           <td>- ${formatPrice(qData.formulaDetails.discountAmount)}</td>
                         </tr>`
                      : ''
                  }
                  <tr>
                    <td>Total Formule HT</td>
                    <td>${formatPrice(qData.formulaDetails.finalTotal)}</td>
                  </tr>
                  <tr>
                    <td>TVA (${qData.formulaDetails.taxRate}%)</td>
                    <td>${formatPrice(qData.formulaDetails.finalTotal * qData.formulaDetails.taxRate / 100)}</td>
                  </tr>
                  <tr>
                    <th>Total Formule TTC</th>
                    <th>${formatPrice(qData.formulaDetails.totalTTC)}</th>
                  </tr>
                </table>
              </div>
            `
            : '<p>Aucune formule sélectionnée</p>'
        }
      </div>
      <hr />
      <div class="section">
        <h2>Équipements (mensuel)</h2>
        ${
          qData.equipments && qData.equipments.length > 0
            ? `<table>
                 <tr>
                   <th>Nom</th>
                   <th>Quantité</th>
                   <th>Prix unitaire HT</th>
                   <th>Total HT</th>
                   <th>1ère unité gratuite</th>
                 </tr>
                 ${qData.equipments.map(eq => `
                   <tr>
                     <td>${eq.name}</td>
                     <td>${eq.quantity}</td>
                     <td>${formatPrice(eq.price)}</td>
                     <td>${formatPrice(eq.price * eq.quantity)}</td>
                     <td>${eq.isFirstUnitFree ? 'Oui' : 'Non'}</td>
                   </tr>
                 `).join('')}
               </table>`
            : '<p>Aucun équipement.</p>'
        }
      </div>
      <hr />
      <div class="section">
        <h2>Total du Devis</h2>
        <table>
          <tr>
            <th>Élément</th>
            <th>Montant</th>
          </tr>
          <tr>
            <td>Équipements (global)</td>
            <td>${formatPrice(qData.totals.equipmentTotal)}</td>
          </tr>
          ${
            qData.engagement.discount > 0
              ? `<tr>
                   <td>Remise (${qData.engagement.discount}%)</td>
                   <td>- ${formatPrice(qData.totals.discountAmount)}</td>
                 </tr>`
              : ''
          }
          <tr>
            <td>Sous-Total HT</td>
            <td>${formatPrice(qData.totals.subTotalHT)}</td>
          </tr>
          <tr>
            <td>TVA (${qData.totals.taxRate}%)</td>
            <td>${formatPrice(qData.totals.tvaAmount)}</td>
          </tr>
          <tr>
            <th>Total TTC</th>
            <th>${formatPrice(qData.totals.finalTTC)}</th>
          </tr>
        </table>
      </div>
      <hr />
      <div class="section">
        <h3>Tarifs</h3>
        <div class="details">
          <p><strong>Première facturation (premier mois) :</strong></p>
          <p><strong>HT :</strong> ${formatPrice(qData.totals.firstMonthCostHT)}</p>
          <p><strong>TTC :</strong> ${formatPrice(qData.totals.firstMonthCostTTC)}</p>
          <p style="font-size: 0.9rem; font-style: italic; color: #555;">
            Ce montant inclut le tarif mensuel récurrent et le coût unique d'installation (premier mois uniquement).
          </p>
          <br/>
          <p><strong>Tarif mensuel HT (30 jours) :</strong> ${formatPrice(qData.totals.monthlyHT)}</p>
          <p><strong>Tarif mensuel TTC (30 jours) :</strong> ${formatPrice(qData.totals.monthlyTTC)}</p>
          <p style="font-size: 0.9rem; font-style: italic; color: #555;">
            Ce tarif récurrent n'inclut pas le coût d'installation et la remise s'applique uniquement sur ce tarif.
          </p>
          <br/>
          <p><strong>Tarif sur l'engagement HT (${qData.engagement.duration} mois) :</strong> ${formatPrice(qData.totals.totalEngagementHT)}</p>
          <p><strong>Tarif sur l'engagement TTC (${qData.engagement.duration} mois) :</strong> ${formatPrice(qData.totals.totalEngagementTTC)}</p>
          <p style="font-size: 0.9rem; font-style: italic; color: #555;">
            Ce montant correspond au coût total sur la durée d'engagement.
          </p>
        </div>
      </div>
      <hr />
      <p style="font-size: 16px; font-style: italic; color: #333; margin-top: 20px;">
        Je reste à votre disposition pour toute précision concernant ce devis.
      </p>
      <div class="signature" style="background: #f2f2f2; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-top: 30px; width: 50%; min-width: 300px;">
        <div class="signature-logo" style="margin-right: 20px;">
          <img src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png" alt="Logo Welleat" style="width: 70px; height: 70px; object-fit: contain;" />
        </div>
        <div class="signature-info">
          <p style="font-size: 18px; font-weight: bold; color: #13674e; margin-bottom: 5px;">
            ${qData.user.firstName} ${qData.user.lastName}
          </p>
          ${qData.user.position ? `<p style="font-size: 14px; color: #666;">${qData.user.position}</p>` : ''}
          ${qData.user.email !== 'N/A' ? `<p><a href="mailto:${qData.user.email}" style="color: #13674e; text-decoration: none; font-weight: bold;">${qData.user.email}</a></p>` : ''}
          ${qData.user.phone ? `<p><a href="tel:${qData.user.phone}" style="color: #13674e; text-decoration: none; font-weight: bold;">${qData.user.phone}</a></p>` : ''}
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-info-section footer-info">
        <p>SAS Welleat</p>
        <div class="social-links">
          <a href="https://www.facebook.com/welleat.fr" target="_blank">Facebook</a>
          <span class="separator">|</span>
          <a href="https://www.linkedin.com/company/well-eat/" target="_blank">LinkedIn</a>
          <span class="separator">|</span>
          <a href="https://www.instagram.com/welleat.app/" target="_blank">Instagram</a>
        </div>
        <p>Dunkerque, 59240 France</p>
        <p>EuraTechnologies – Lille, 59000 France</p>
        <p><a href="mailto:contact@welleat.fr" style="color: #fff; text-decoration: none;">contact@welleat.fr</a></p>
        <p><a href="tel:0787348434" style="color: #fff; text-decoration: none;">07 87 34 84 34</a></p>
        <div class="legal-info">
          <p>Forme juridique : SAS (Société par Actions Simplifiée)</p>
          <p>SIRET : 912 746 088 00018</p>
          <p>Capital social : 29 000,00 €</p>
          <p>Numéro TVA : FR56 912 746 088</p>
          <p>© ${currentYear} Tous droits réservés.</p>
        </div>
        <div class="cgv-link">
          <p><a href="#" target="_blank">Consultez nos conditions générales de vente</a></p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

class QuoteEmailService {
  async sendDetailedQuoteEmail(recipientEmails, quote, profileData) {
    try {
      const htmlContent = _generateStyledEmailTemplate(quote, profileData);
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: recipientEmails.join(','),
        subject: `Votre devis Welleat #${quote.id}`,
        html: htmlContent,
      };
      await sendEmail(mailOptions);
      logger.info(`Email détaillé du devis #${quote.id} envoyé à : ${recipientEmails.join(', ')}`);
    } catch (error) {
      logger.error(`Erreur envoi email devis #${quote.id} : ${error.message}`);
      throw error;
    }
  }
}

module.exports = new QuoteEmailService();
