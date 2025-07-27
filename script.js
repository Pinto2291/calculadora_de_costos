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

    const guardarBtn = document.getElementById("guardar-procedimiento");
    const eliminarBtn = document.getElementById("eliminar-procedimiento");
    const selectProcedimientos = document.getElementById("procedimientos-guardados");
    const ctx = document.getElementById('grafico-costos').getContext('2d');
    const imprimirBtn = document.getElementById('imprimir');

    // ------------------------------------------------------------ //

    // Obtén los nuevos inputs al inicio de tu script
    const costosFijosInput = document.getElementById("costos-fijos");
    const procedimientosMesInput = document.getElementById("procedimientos-mes");
    const tiempoProcedimientoInput = document.getElementById("tiempo-procedimiento");

    // ---------------------------------- // - grafico 

    let graficoCostos = new Chart(ctx, {
    type: 'doughnut', // O 'pie'
    data: {
        labels: ['Materiales', 'Costos Fijos', 'Valor del Tiempo', 'Ganancia'],
        datasets: [{
            label: 'Desglose de Precio',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(16, 185, 129, 0.8)'
            ],
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
        }]
    },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });

    function actualizarGrafico(data) {
        graficoCostos.data.datasets[0].data = [
            data.materiales, 
            data.costosFijos, 
            data.tiempo, 
            data.ganancia
        ];
        graficoCostos.update();
    }
    

function calcular() {
    const bcv = parseFloat(bcvInput.value) || 0;
    let totalMateriales = 0;

    [...listaInsumos.children].forEach(row => {
        const [nombre, costo, cantidad, usdUsoEl] = row.querySelectorAll("input, .costo-dolar");
        const costoVal = parseFloat(costo.value) || 0;
        const cantidadVal = parseFloat(cantidad.value) || 1;
        const usoUsd = costoVal / cantidadVal;
        totalMateriales += usoUsd;
        usdUsoEl.textContent = "$" + formato(usoUsd);
    });

    // --- Lógica nueva ---
    const costosFijos = parseFloat(costosFijosInput.value) || 0;
    const procedimientosMes = parseFloat(procedimientosMesInput.value) || 1;
    const tiempoProcedimiento = parseFloat(tiempoProcedimientoInput.value) || 0;
    
    // Asumiremos un costo por hora de $10, puedes cambiarlo o añadir otro input
    // Después:
    const costoPorHora = parseFloat(localStorage.getItem('config_costo_hora')) || 10;
    const costoFijoPorProcedimiento = costosFijos / procedimientosMes;
    const costoPorTiempo = (costoPorHora / 60) * tiempoProcedimiento;

    // El nuevo costo total es la suma de materiales + fijos + tiempo
    const costoTotal = totalMateriales + costoFijoPorProcedimiento + costoPorTiempo;
    
    totalDisplay.textContent = "$" + formato(costoTotal); // Actualiza el display de costo total

    const margen = parseFloat(margenInput.value) || 0;
    const adicional = parseFloat(adicionalInput.value) || 0;
    // El precio de venta ahora se calcula sobre el nuevo costo total
    const precio = costoTotal * (1 + margen / 100) + adicional;

    precioOriginal.textContent = "Precio exacto: $" + formato(precio);
    precioFinal.textContent = "$" + formato(precio);
    precioBs.textContent = "Bs " + formato(precio * bcv);

        // --- DENTRO de tu función calcular(), al final, antes del return ---
    // ...
    // const precio = costoTotal * (1 + margen / 100) + adicional;
    // ...

    const ganancia = precio - costoTotal;
    actualizarGrafico({
        materiales: totalMateriales,
        costosFijos: costoFijoPorProcedimiento,
        tiempo: costoPorTiempo,
        ganancia: ganancia
    });

    return { precio, precioBs: precio * bcv };
}

    // ------------------------------------------------------------ //

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
        
        // Nueva lógica: Redondea hacia el próximo número entero
        const redondeado = Math.ceil(precio);
        const redondeadoBs = Math.ceil(precioBsf);
        
        // Usa la función formato para asegurar que se muestren los decimales (ej: 22.00)
        const simboloMoneda = localStorage.getItem('config_moneda') || '$';
        precioFinal.textContent = simboloMoneda + " " + formato(redondeado);
        precioBs.textContent = "Bs " + formato(redondeadoBs);
    });

    listaInsumos.addEventListener("input", calcular);

    function popularSelectProcedimientos() {
        const procedimientos = JSON.parse(localStorage.getItem('procedimientos_guardados')) || {};
        selectProcedimientos.innerHTML = '<option value="">-- Selecciona un procedimiento --</option>';
        for (const nombre in procedimientos) {
            const option = document.createElement('option');
            option.value = nombre;
            option.textContent = nombre;
            selectProcedimientos.appendChild(option);
        }
    }

    guardarBtn.addEventListener('click', () => {
        const nombre = nombreProcedimientoInput.value.trim();
        if (!nombre) {
            alert('Por favor, ingresa un nombre para el procedimiento antes de guardarlo.');
            return;
        }

        const insumos = [...listaInsumos.children].map(row => {
            const inputs = row.querySelectorAll("input");
            return { nombre: inputs[0].value, costo: inputs[1].value, cantidad: inputs[2].value };
        });

        const procedimiento = {
            bcv: bcvInput.value,
            nombre: nombre,
            costosFijos: costosFijosInput.value,
            procedimientosMes: procedimientosMesInput.value,
            tiempoProcedimiento: tiempoProcedimientoInput.value,
            margen: margenInput.value,
            adicional: adicionalInput.value,
            insumos: insumos
        };

        const procedimientosGuardados = JSON.parse(localStorage.getItem('procedimientos_guardados')) || {};
        procedimientosGuardados[nombre] = procedimiento;
        localStorage.setItem('procedimientos_guardados', JSON.stringify(procedimientosGuardados));
        
        alert(`Procedimiento "${nombre}" guardado.`);
        popularSelectProcedimientos();
    });

    selectProcedimientos.addEventListener('change', (e) => {
        const nombre = e.target.value;
        if (!nombre) return;

        const procedimientosGuardados = JSON.parse(localStorage.getItem('procedimientos_guardados')) || {};
        const p = procedimientosGuardados[nombre];

        bcvInput.value = p.bcv;
        nombreProcedimientoInput.value = p.nombre;
        costosFijosInput.value = p.costosFijos;
        procedimientosMesInput.value = p.procedimientosMes;
        tiempoProcedimientoInput.value = p.tiempoProcedimiento;
        margenInput.value = p.margen;
        adicionalInput.value = p.adicional;

        listaInsumos.innerHTML = '';
        p.insumos.forEach(insumo => {
            agregarInsumo(insumo.nombre, insumo.costo, insumo.cantidad);
        });
        if (p.insumos.length === 0) {
            agregarInsumo();
        }

        calcular();
        lucide.createIcons();
    });

    eliminarBtn.addEventListener('click', () => {
        const nombre = selectProcedimientos.value;
        if (!nombre) {
            alert('Por favor, selecciona un procedimiento de la lista para eliminar.');
            return;
        }
        
        if (confirm(`¿Estás segura de que quieres eliminar el procedimiento "${nombre}"?`)) {
            const procedimientosGuardados = JSON.parse(localStorage.getItem('procedimientos_guardados')) || {};
            delete procedimientosGuardados[nombre];
            localStorage.setItem('procedimientos_guardados', JSON.stringify(procedimientosGuardados));
            alert(`Procedimiento "${nombre}" eliminado.`);
            popularSelectProcedimientos();
        }
    });

    function generarReporteHTML() {
        const nombreProc = nombreProcedimientoInput.value || "Procedimiento sin nombre";
        const precioVenta = precioFinal.textContent;
        const costoTotal = totalDisplay.textContent;
        const simboloMoneda = localStorage.getItem('config_moneda') || '$';

    let insumosHTML = '';
    const filasInsumos = document.querySelectorAll("#lista-insumos > .grid");

    filasInsumos.forEach(row => {
        const nombreInsumo = row.querySelector("input[type='text']").value;
        const costoPorUso = row.querySelector(".costo-dolar").textContent;
        
        if (nombreInsumo) {
            insumosHTML += `
                <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
                    <span>${nombreInsumo}</span>
                    <span>Costo por uso: ${costoPorUso}</span>
                </div>
            `;
        }
    });

    const reporteHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; color: #000;">
            <h1 style="text-align: center; color: #000;">Reporte de Costos</h1>
            <h2 style="color: #333;">${nombreProc}</h2>
            <hr>
            <h3>Resumen de Precio</h3>
            <p><strong>Precio de Venta Sugerido:</strong> ${precioVenta}</p>
            <p><strong>Costo Total del Procedimiento:</strong> ${costoTotal}</p>
            <hr>
            <h3>Desglose de Insumos (Costo por Uso en ${simboloMoneda})</h3>
            ${insumosHTML}
        </div>
    `;

        const reporteContenedor = document.getElementById('reporte-imprimible');
        reporteContenedor.innerHTML = reporteHTML;
    }

    // El evento que activa todo, ahora con setTimeout
    imprimirBtn.addEventListener('click', () => {
        generarReporteHTML();
        setTimeout(() => {
            window.print();
        }, 100);
    });

    // Añadir un input por defecto al cargar
    window.addEventListener('DOMContentLoaded', () => {
        agregarInsumo();
        popularSelectProcedimientos();
    });