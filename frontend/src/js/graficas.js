// Configuración de la primera gráfica (Distribución por tipo de discapacidad auditiva)
const ctx1 = document.getElementById('chart1').getContext('2d');
new Chart(ctx1, {
    type: 'pie',
    data: {
        labels: ['Sordera total', 'Hipoacusia severa', 'Hipoacusia moderada', 'Otras discapacidades auditivas'],
        datasets: [{
            data: [120000, 180000, 140000, 19772],
            backgroundColor: [
                '#5e35b1',
                '#7e57c2',
                '#b39ddb',
                '#d1c4e9'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Distribución por tipo de discapacidad auditiva en Colombia',
                font: { size: 16 }
            },
            legend: { position: 'bottom' }
        }
    }
});

// Configuración de la segunda gráfica (Distribución por edad)
const ctx2 = document.getElementById('chart2').getContext('2d');
new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['0-17 años', '18-29 años', '30-45 años', '46-64 años', '65+ años'],
        datasets: [{
            label: 'Personas con discapacidad auditiva',
            data: [85000, 95000, 120000, 110000, 49772],
            backgroundColor: '#5e35b1',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Distribución por grupos de edad',
                font: { size: 16 }
            }
        },
        scales: {
            y: { 
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de personas'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Grupo de edad'
                }
            }
        }
    }
});

// Configuración de la tercera gráfica (Acceso a educación)
const ctx3 = document.getElementById('chart3').getContext('2d');
new Chart(ctx3, {
    type: 'doughnut',
    data: {
        labels: ['Educación especial', 'Educación regular con apoyo', 'Educación regular sin apoyo', 'Sin acceso a educación'],
        datasets: [{
            data: [150000, 120000, 100000, 89772],
            backgroundColor: [
                '#3949ab',
                '#5e35b1',
                '#7e57c2',
                '#d1c4e9'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Acceso a educación para personas con discapacidad auditiva',
                font: { size: 16 }
            },
            legend: { position: 'bottom' }
        }
    }
});

// Configuración de la cuarta gráfica (Empleo)
const ctx4 = document.getElementById('chart4').getContext('2d');
new Chart(ctx4, {
    type: 'bar',
    data: {
        labels: ['Empleo formal', 'Empleo informal', 'Desempleados', 'Inactivos'],
        datasets: [{
            label: 'Situación laboral',
            data: [80000, 150000, 120000, 109772],
            backgroundColor: '#3949ab',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Situación laboral de personas con discapacidad auditiva',
                font: { size: 16 }
            }
        },
        scales: {
            y: { 
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de personas'
                }
            }
        }
    }
});

// Configuración de la quinta gráfica (Acceso a intérpretes)
const ctx5 = document.getElementById('chart5').getContext('2d');
new Chart(ctx5, {
    type: 'polarArea',
    data: {
        labels: ['Intérpretes certificados', 'Intérpretes no certificados', 'Familiares que interpretan', 'Sin acceso a intérpretes'],
        datasets: [{
            data: [5000, 25000, 150000, 279772],
            backgroundColor: [
                '#1a237e',
                '#3949ab',
                '#5e35b1',
                '#7e57c2'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Acceso a intérpretes de lengua de señas',
                font: { size: 16 }
            },
            legend: { position: 'bottom' }
        }
    }
});

// Configuración de la sexta gráfica (Comparación regional)
const ctx6 = document.getElementById('chart6').getContext('2d');
new Chart(ctx6, {
    type: 'radar',
    data: {
        labels: ['Bogotá', 'Antioquia', 'Valle del Cauca', 'Santander', 'Cundinamarca', 'Costa Caribe'],
        datasets: [{
            label: 'Personas con discapacidad auditiva',
            data: [120000, 90000, 75000, 45000, 40000, 59772],
            backgroundColor: 'rgba(94, 53, 177, 0.2)',
            borderColor: '#5e35b1',
            pointBackgroundColor: '#5e35b1',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#5e35b1'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Distribución regional de la discapacidad auditiva',
                font: { size: 16 }
            }
        },
        scales: {
            r: {
                angleLines: { display: true },
                suggestedMin: 0,
                suggestedMax: 150000
            }
        }
    }
});

// Configuración de la séptima gráfica (Evolución temporal)
const ctx7 = document.getElementById('chart7').getContext('2d');
new Chart(ctx7, {
    type: 'line',
    data: {
        labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022'],
        datasets: [{
            label: 'Personas con discapacidad auditiva registradas',
            data: [320000, 350000, 380000, 400000, 420000, 440000, 459772],
            fill: false,
            backgroundColor: '#5e35b1',
            borderColor: '#5e35b1',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Evolución de la población con discapacidad auditiva',
                font: { size: 16 }
            }
        },
        scales: {
            y: { 
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Número de personas'
                }
            }
        }
    }
});