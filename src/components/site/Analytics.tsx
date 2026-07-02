import Script from "next/script";

/**
 * GoatCounter analytics — alternativa privacy-friendly a Google Analytics.
 *
 * Es el mismo servicio que ya usaba el sitio anterior
 * (https://maldonado-electricidad.goatcounter.com). Se carga de forma
 * diferida (afterInteractive) para no afectar el rendimiento.
 *
 * Si en el futuro querés desactivarlo, basta con eliminar este componente
 * del layout.
 */
export function Analytics() {
  return (
    <Script
      data-goatcounter="https://maldonado-electricidad.goatcounter.com/count"
      async
      src="//gc.zgo.at/count.js"
      strategy="afterInteractive"
    />
  );
}
