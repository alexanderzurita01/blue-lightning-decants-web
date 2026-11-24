# Blue Lightning Decants

Tienda estática de perfumes y decants de 5 y 10 ml para Chile. El catálogo inicial y sus precios son demostrativos. El carrito se guarda en el navegador y los pedidos se preparan para WhatsApp. La tienda funciona sin servidor de aplicación ni procesamiento de pagos.

## Desarrollo local

Usa Node.js 22.12 o posterior (la rama 20 también es compatible desde 20.19).

```bash
npm ci
npm run dev
```

Abre la dirección que muestra Vite. Para verificar la compilación de producción:

```bash
npm run build
npm run preview
```

## Catálogo y WhatsApp

- Edita `src/catalog.js` para actualizar los perfumes, familias, descripciones y precios en CLP por tamaño. Mantén los identificadores estables para preservar los carritos guardados.
- El aviso del catálogo y el texto del pedido están en `src/main.jsx`. Actualízalos cuando se confirme el catálogo real.
- Copia `.env.example` a `.env.local` y asigna el número real de la tienda a `VITE_WHATSAPP_NUMBER`. Usa el formato internacional, con código de país y solo dígitos. Reinicia Vite o vuelve a compilar tras cambiarlo.
- Con un número válido, el carrito abre WhatsApp con productos, tamaños, cantidades, subtotales y total. El cliente revisa y envía el mensaje manualmente. Mientras falte el número, la página muestra un aviso y deshabilita el pedido.
- Las variables con prefijo `VITE_` se incluyen en el sitio publicado. Úsalas solo para datos públicos.

## Cloudflare Pages

Conecta el repositorio en **Workers & Pages → Create → Pages → Connect to Git** y configura el proyecto:

| Campo | Valor |
| --- | --- |
| Rama de producción | `main` |
| Directorio raíz | Raíz del repositorio |
| Comando de compilación | `npm run build` |
| Directorio de salida | `dist` |
| Versión de Node.js | 22.12 o posterior mediante `NODE_VERSION` |

Para activar los pedidos, agrega `VITE_WHATSAPP_NUMBER` a las variables de compilación del entorno correspondiente y vuelve a desplegar. También puedes compilar localmente y subir `dist` con Direct Upload.
