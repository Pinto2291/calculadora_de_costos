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

    // Ya no se selecciona el elemento ".costo-bolivar" de la fila
    [...listaInsumos.children].forEach(row => {
        const [nombre, costo, cantidad, usdUsoEl] = row.querySelectorAll("input, .costo-dolar");
        const costoVal = parseFloat(costo.value) || 0;
        const cantidadVal = parseFloat(cantidad.value) || 1;
        const usoUsd = costoVal / cantidadVal;
        
        total += usoUsd;
        usdUsoEl.textContent = "$" + formato(usoUsd);
    });

    totalDisplay.textContent = "$" + formato(total);

    const margen = parseFloat(margenInput.value) || 0;
    const adicional = parseFloat(adicionalInput.value) || 0;
    const precio = total * (1 + margen / 100) + adicional;

    precioOriginal.textContent = "Precio exacto: $" + formato(precio);
    precioFinal.textContent = "$" + formato(precio);
    // El cálculo en Bolívares se mantiene para el resumen final
    precioBs.textContent = "Bs " + formato(precio * bcv); 

    return { precio, precioBs: precio * bcv };
    }

    function agregarInsumo(nombre = '', costo = '', cantidad = '') {
    const div = document.createElement("div");
    div.className = "grid grid-cols-6 gap-2 items-center";
    div.innerHTML = `
        <input type="text" class="col-span-2 bg-gray-700 p-2 rounded" placeholder="Ej: Crema limpiadora" value="${nombre}">
        <input type="number" class="col-span-1 bg-gray-700 p-2 rounded" placeholder="Costo" step="0.01" value="${costo}">
        <input type="number" class="col-span-1 bg-gray-700 p-2 rounded" placeholder="Cant." step="0.01" value="${cantidad}">
        <div class="costo-dolar col-span-1 text-center">$0.00</div>
        
        <div class="col-span-1 flex justify-center">
            <button class="text-red-500 hover:text-red-700 p-1" onclick="this.closest('div.grid').remove(); calcular();">
                <i data-lucide="trash-2" class="w-5 h-5"></i>
            </button>
        </div>
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