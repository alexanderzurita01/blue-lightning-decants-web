export const products = [
  { id: 'sauvage', brand: 'DIOR', name: 'Sauvage EDP', family: 'Amaderado', description: 'Bergamota vibrante, especias y un fondo cálido de vainilla.', prices: { 5: 8990, 10: 15990 }, tone: 'blue' },
  { id: 'eros', brand: 'VERSACE', name: 'Eros EDT', family: 'Fresco', description: 'Menta y manzana verde con un fondo dulce de vainilla.', prices: { 5: 6990, 10: 11990 }, tone: 'teal' },
  { id: 'libre', brand: 'YVES SAINT LAURENT', name: 'Libre EDP', family: 'Floral', description: 'Lavanda aromática y flor de azahar sobre un fondo de vainilla.', prices: { 5: 9490, 10: 16990 }, tone: 'gold' },
  { id: 'bleu', brand: 'CHANEL', name: 'Bleu de Chanel EDP', family: 'Amaderado', description: 'Cítricos luminosos, incienso y maderas de carácter.', prices: { 5: 10990, 10: 19990 }, tone: 'navy' },
  { id: 'cloud', brand: 'ARIANA GRANDE', name: 'Cloud EDP', family: 'Dulce', description: 'Pera, coco cremoso y praliné con un toque de almizcle.', prices: { 5: 6490, 10: 10990 }, tone: 'violet' },
  { id: 'acqua', brand: 'GIORGIO ARMANI', name: 'Acqua di Giò EDT', family: 'Fresco', description: 'Notas marinas, bergamota y cedro para una sensación ligera.', prices: { 5: 7990, 10: 13990 }, tone: 'silver' },
]

export const sizes = [5, 10]
export const families = [...new Set(products.map(product => product.family))]
export const currency = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })
export const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').trim()
export const whatsappUrl = /^[1-9]\d{7,14}$/.test(whatsappNumber) ? `https://wa.me/${whatsappNumber}` : ''
