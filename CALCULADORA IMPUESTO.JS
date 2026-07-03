/**
 * Sistema de cálculo de impuestos con múltiples regiones
 * Cada región puede tener diferentes porcentajes y bonos
 */

// Configuración de regiones
const CONFIG_REGIONES = {
    sv: {
        nombre: "El Salvador",
        porcentajeDescuento: 0.15,
        bono: 13,
        moneda: "$",
        impuestoAdicional: 0
    },
    us: {
        nombre: "Estados Unidos",
        porcentajeDescuento: 0.20,
        bono: 0,
        moneda: "$",
        impuestoAdicional: 0.05
    },
    mx: {
        nombre: "México",
        porcentajeDescuento: 0.16,
        bono: 0,
        moneda: "$",
        impuestoAdicional: 0.03
    },
    gt: {
        nombre: "Guatemala",
        porcentajeDescuento: 0.12,
        bono: 0,
        moneda: "Q",
        impuestoAdicional: 0
    },
    default: {
        nombre: "Otro país",
        porcentajeDescuento: 0.15,
        bono: 0,
        moneda: "$",
        impuestoAdicional: 0
    }
};

/**
 * Calcula impuestos con configuración por región
 * @param {number} salario - Salario bruto
 * @param {number} deduccionBase - Base de deducción
 * @param {string} region - Código de región (sv, us, mx, gt, etc.)
 * @param {Object} opciones - Configuraciones adicionales
 * @returns {Object} Resultado detallado del cálculo
 */
function calcularImpuestosAvanzado(salario, deduccionBase, region, opciones = {}) {
    // Obtener configuración de la región
    const regionNormalizada = region.toLowerCase();
    const config = CONFIG_REGIONES[regionNormalizada] || CONFIG_REGIONES.default;
    
    // Validaciones
    if (salario <= 0) throw new Error("El salario debe ser positivo");
    if (deduccionBase < 0) throw new Error("La base de deducción no puede ser negativa");
    
    // Cálculos
    const descuento = deduccionBase * config.porcentajeDescuento;
    const impuestoAdicional = salario * (config.impuestoAdicional || 0);
    let neto = salario - descuento - impuestoAdicional;
    
    // Aplicar bono
    if (config.bono > 0) {
        neto += config.bono;
    }
    
    // Aplicar descuentos adicionales si existen
    if (opciones.descuentoAdicional) {
        neto -= opciones.descuentoAdicional;
    }
    
    // Redondear
    neto = Math.round(neto * 100) / 100;
    
    // Retornar objeto con detalles
    return {
        region: regionNormalizada,
        nombreRegion: config.nombre,
        moneda: config.moneda,
        salarioBruto: salario,
        deduccionBase: deduccionBase,
        porcentajeDescuento: config.porcentajeDescuento * 100 + "%",
        descuentoAplicado: descuento,
        impuestoAdicional: impuestoAdicional,
        bonoAplicado: config.bono || 0,
        salarioNeto: neto,
        totalDeducciones: descuento + impuestoAdicional,
        formula: `(${salario} - ${descuento} - ${impuestoAdicional}) + ${config.bono || 0} = ${neto}`
    };
}

// Ejemplo de uso avanzado
console.log("\n=== SISTEMA MULTI-REGIÓN ===");
const resultadoSV = calcularImpuestosAvanzado(1000, 150, "SV");
const resultadoUS = calcularImpuestosAvanzado(1000, 150, "US");
const resultadoMX = calcularImpuestosAvanzado(1000, 150, "MX");

console.log("📊 El Salvador:", resultadoSV);
console.log("📊 USA:", resultadoUS);
console.log("📊 México:", resultadoMX);