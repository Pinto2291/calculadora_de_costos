const formato = n => n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const listaInsumos = document.getElementById("lista-insumos");
    const btnAgregar = document.getElementById("agregar-insumo");
    const bcvInput = document.getElementById("bcv");
    const margenInput = document.getElementById("margen-ganancia");
    const adicionalInput = document.getElementById("ganancia-adicional");
    const totalDisplay = document.getElementById("costo-total");
    const nombreProcedimientoInput = document.getElementById("nombre-procedimiento");
    const nombreProcedimientoTitulo = document.getElementById("nombre-procedimiento-titulo");
    const nombreProcedimientoHeader = document.getElementById("nombre-procedimiento-header");
    const precioOriginal = document.getElementById("precio-original");
    const precioFinal = document.getElementById("precio-final");
    const precioBs = document.getElementById("precio-bs");
    const redondearBtn = document.getElementById("redondear");

    function calcular() {
    const bcv = parseFloat(bcvInput.value) || 0;
    let total = 0;

    // Ya no se selecciona ni se usa 'porcentajeEl'
    [...listaInsumos.children].forEach(row => {
        const [nombre, costo, cantidad, usdUsoEl, bsUsoEl] = row.querySelectorAll("input, .costo-dolar, .costo-bolivar");
        const costoVal = parseFloat(costo.value) || 0;
        const cantidadVal = parseFloat(cantidad.value) || 1;
        const usoUsd = costoVal / cantidadVal;
        const usoBs = usoUsd * bcv;
        total += usoUsd;
        usdUsoEl.textContent = "$" + formato(usoUsd);
        bsUsoEl.textContent = "Bs " + formato(usoBs);
    });

    totalDisplay.textContent = "$" + formato(total);

    // El bloque forEach para calcular porcentaje se ha eliminado completamente.

    const margen = parseFloat(margenInput.value) || 0;
    const adicional = parseFloat(adicionalInput.value) || 0;
    const precio = total * (1 + margen / 100) + adicional;

    precioOriginal.textContent = "Precio exacto: $" + formato(precio);
    precioFinal.textContent = "$" + formato(precio);
    precioBs.textContent = "Bs " + formato(precio * bcv);

    return { precio, precioBs: precio * bcv };
    }

    function agregarInsumo(nombre = '', costo = '', cantidad = '') {
        const div = document.createElement("div");
        // Usamos 6 columnas, que se adaptan mucho mejor a móviles.
        div.className = "grid grid-cols-6 gap-2 items-center";
        div.innerHTML = `
            <div class="col-span-2 flex items-center gap-1">
                <input type="text" class="w-full bg-gray-700 p-2 rounded" placeholder="Ej: Crema limpiadora" value="${nombre}">
                <button class="text-red-500 hover:text-red-700 p-1 flex-shrink-0" onclick="this.closest('div.grid').remove(); calcular();">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
            
            <input type="number" class="col-span-1 bg-gray-700 p-2 rounded" placeholder="Costo" step="0.01" value="${costo}">
            <input type="number" class="col-span-1 bg-gray-700 p-2 rounded" placeholder="Cant." step="0.01" value="${cantidad}">
            <div class="costo-dolar col-span-1 text-center">$0.00</div>
            <div class="costo-bolivar col-span-1 text-center">Bs 0.00</div>
        `;
        listaInsumos.appendChild(div);
        calcular();
        lucide.createIcons();
    }



    btnAgregar.addEventListener("click", () => agregarInsumo());
    bcvInput.addEventListener("input", calcular);
    margenInput.addEventListener("input", calcular);
    adicionalInput.addEventListener("input", calcular);
    nombreProcedimientoInput.addEventListener("input", () => {
        nombreProcedimientoTitulo.textContent = nombreProcedimientoInput.value;
    });

    redondearBtn.addEventListener("click", () => {
        const { precio, precioBs: precioBsf } = calcular();
        const redondeado = Math.ceil(precio / 5) * 5;
        const redondeadoBs = Math.ceil(precioBsf / 5) * 5;
        precioFinal.textContent = "$" + formato(redondeado);
        precioBs.textContent = "Bs " + formato(redondeadoBs);
    });

    listaInsumos.addEventListener("input", calcular);

    // Añadir un input por defecto al cargar
    window.addEventListener('DOMContentLoaded', () => {
        agregarInsumo();
    });