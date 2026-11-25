import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { currency, families, products, sizes, whatsappUrl } from './catalog'
import './styles.css'

const logoBase = `${import.meta.env.BASE_URL}blue-lightning-logo`

const storageKey = 'blue-lightning-cart'
const productById = new Map(products.map(product => [product.id, product]))

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey))
    return Array.isArray(saved) ? saved.filter(item =>
      item && productById.has(item.id) && sizes.includes(item.size) &&
      Number.isSafeInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99
    ) : []
  } catch {
    return []
  }
}

function normalize(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

function ProductCard({ product, onAdd }) {
  const [size, setSize] = useState(5)
  return (
    <article className="product">
      <div className={`product-art ${product.tone}`} aria-hidden="true">
        <span className="family">{product.family}</span>
        <div className="vial"><div className="vial-label"><span>ϟ</span><small>BLUE<br />LIGHTNING</small></div></div>
      </div>
      <div className="product-content">
        <p className="brand">{product.brand}</p>
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="sizes" role="group" aria-label={`Tamaño de ${product.name}`}>
          {sizes.map(option => <button key={option} type="button" aria-pressed={size === option} onClick={() => setSize(option)}>{option} ml</button>)}
        </div>
        <div className="product-buy">
          <strong>{currency.format(product.prices[size])}</strong>
          <button className="button add" onClick={() => onAdd(product.id, size)} aria-label={`Agregar ${product.name} de ${size} ml`}>＋ Agregar</button>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [family, setFamily] = useState('')
  const [cart, setCart] = useState(readCart)
  const [announcement, setAnnouncement] = useState('')
  const dialog = useRef(null)

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(cart)) } catch { /* El carrito sigue disponible en memoria. */ }
  }, [cart])

  const visible = products.filter(product => {
    const searchable = normalize(`${product.name} ${product.brand} ${product.family} ${product.description}`)
    return (!family || product.family === family) && searchable.includes(normalize(query.trim()))
  })
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + productById.get(item.id).prices[item.size] * item.quantity, 0)
  const order = [
    '¡Hola! Quisiera consultar por este pedido de Blue Lightning Decants:',
    ...cart.map(({ id, size, quantity }) => {
      const product = productById.get(id)
      return `• ${quantity} × ${product.brand} ${product.name} (${size} ml): ${currency.format(product.prices[size] * quantity)}`
    }),
    `Total referencial: ${currency.format(total)} CLP`,
    'Los productos y precios son demostrativos. ¿Me pueden confirmar disponibilidad, precio y despacho?',
  ].join('\n')

  function changeQuantity(id, size, delta) {
    setCart(current => {
      const existing = current.find(item => item.id === id && item.size === size)
      if (!existing) return delta > 0 ? [...current, { id, size, quantity: 1 }] : current
      return current.map(item => item === existing
        ? { ...item, quantity: Math.min(99, item.quantity + delta) }
        : item).filter(item => item.quantity > 0)
    })
  }

  function addProduct(id, size) {
    changeQuantity(id, size, 1)
    setAnnouncement(`Carrito actualizado con ${productById.get(id).name} de ${size} ml.`)
  }

  return (
    <>
      <header className="site-header" id="inicio">
        <div className="shell header-content">
          <a className="logo" href="#inicio">
            <img className="header-logo" src={`${logoBase}-96.webp`} width="96" height="96" alt="" />
            <span>BLUE LIGHTNING<small>DECANTS</small></span>
          </a>
          <nav aria-label="Navegación principal">
            <a href="#catalogo">Catálogo</a><a href="#nosotros">Nosotros</a><a href="#contacto">Contacto</a>
          </nav>
          <button className="cart-trigger" onClick={() => dialog.current.showModal()}>Carrito <span>{count}</span></button>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell hero-content">
            <div className="hero-copy">
              <p className="eyebrow">PERFUMES Y DECANTS EN CHILE</p>
              <h1 id="hero-title">Tu próxima<br /> <em>fragancia.</em></h1>
              <p>Explora perfumes originales en formatos de 5 y 10 ml. Prueba nuevas fragancias antes de elegir tu próxima botella.</p>
              <a className="button primary" href="#catalogo">Explorar catálogo <span aria-hidden="true">↗</span></a>
            </div>
            <img
              className="hero-logo"
              src={`${logoBase}-520.webp`}
              srcSet={`${logoBase}-260.webp 260w, ${logoBase}-520.webp 520w, ${logoBase}-960.webp 960w`}
              sizes="(max-width: 312px) calc(100vw - 52px), (max-width: 700px) 260px, (max-width: 1116px) 43vw, 480px"
              width="520"
              height="520"
              fetchPriority="high"
              alt="Logo oficial de Blue Lightning Decants"
            />
          </div>
        </section>

        <section className="shell catalog" id="catalogo" aria-labelledby="catalog-title">
          <p className="eyebrow">ENCUENTRA TU FRAGANCIA</p>
          <h2 id="catalog-title">Catálogo de decants</h2>
          <p className="demo-note"><strong>Catálogo demostrativo.</strong> Los productos y precios son de ejemplo y están sujetos a confirmación.</p>
          <div className="catalog-controls">
            <label className="search"><span aria-hidden="true">⌕</span><input aria-label="Buscar perfumes" type="search" placeholder="Buscar por perfume, marca o nota" value={query} onChange={event => setQuery(event.target.value)} /></label>
            <div className="filters" role="group" aria-label="Filtrar por familia olfativa">
              <button aria-pressed={!family} onClick={() => setFamily('')}>Todos</button>
              {families.map(option => <button key={option} aria-pressed={family === option} onClick={() => setFamily(option)}>{option}</button>)}
            </div>
          </div>
          <p className="results" aria-live="polite">{visible.length} {visible.length === 1 ? 'fragancia' : 'fragancias'}</p>
          {visible.length ? <div className="grid">{visible.map(product => <ProductCard key={product.id} product={product} onAdd={addProduct} />)}</div> :
            <div className="empty"><p>No encontramos fragancias con esa búsqueda.</p><button className="button" onClick={() => { setQuery(''); setFamily('') }}>Limpiar filtros</button></div>}
        </section>

        <section className="shell info">
          <div id="nosotros"><p className="eyebrow">NOSOTROS</p><h2>Perfumería a tu ritmo</h2><p>Blue Lightning Decants es una tienda chilena dedicada a los perfumes originales. Un decant es una porción de la fragancia original en un atomizador pequeño, ideal para probarla o llevarla contigo.</p></div>
          <div id="contacto"><p className="eyebrow">CONTACTO</p><h2>Hablemos de perfumes</h2><p>Consulta por fragancias, disponibilidad y condiciones de despacho.</p>
            {whatsappUrl ? <a className="button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp ↗</a> : <p className="muted">El número de WhatsApp está pendiente de configuración.</p>}
          </div>
        </section>
      </main>

      <footer><div className="shell footer-content"><a className="logo" href="#inicio"><span className="bolt" aria-hidden="true">ϟ</span><span>BLUE LIGHTNING<small>DECANTS</small></span></a><p>Chile · Precios en pesos chilenos</p></div></footer>
      <p role="status" className="sr-only">{announcement}</p>

      <dialog ref={dialog} aria-labelledby="cart-title" className="cart-dialog">
        <div className="cart-header"><h2 id="cart-title">Tu carrito</h2><button className="close" aria-label="Cerrar carrito" onClick={() => dialog.current.close()}>×</button></div>
        {cart.length === 0 ? <div className="empty"><p>Tu carrito está vacío.</p><button className="button" onClick={() => dialog.current.close()}>Seguir explorando</button></div> :
          <>
            <ul className="cart-items">{cart.map(({ id, size, quantity }) => {
              const product = productById.get(id)
              const label = `${product.name} de ${size} ml`
              return <li key={`${id}-${size}`}>
                <div className="cart-line"><div><strong>{product.name}</strong><p>{size} ml · {currency.format(product.prices[size])} por unidad</p></div><strong>{currency.format(product.prices[size] * quantity)}</strong></div>
                <div className="cart-line"><div className="quantity"><button aria-label={`Restar una unidad de ${label}`} onClick={() => changeQuantity(id, size, -1)}>−</button><span aria-label="Cantidad">{quantity}</span><button aria-label={`Sumar una unidad de ${label}`} disabled={quantity >= 99} onClick={() => changeQuantity(id, size, 1)}>+</button></div>
                  <button className="remove" aria-label={`Quitar ${label}`} onClick={() => setCart(current => current.filter(item => item.id !== id || item.size !== size))}>Quitar</button></div>
              </li>
            })}</ul>
            <div className="cart-summary">
              <div className="cart-line"><span>Total referencial</span><strong>{currency.format(total)} CLP</strong></div>
              {whatsappUrl ? <a className="button primary" href={`${whatsappUrl}?text=${encodeURIComponent(order)}`} target="_blank" rel="noopener noreferrer">Pedir por WhatsApp ↗</a> :
                <><button className="button primary" disabled>Pedir por WhatsApp</button><p className="muted">Falta configurar el número de WhatsApp para enviar pedidos.</p></>}
            </div>
          </>}
      </dialog>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
