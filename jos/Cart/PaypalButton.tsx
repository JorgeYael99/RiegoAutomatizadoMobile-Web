// frontend/web/src/pages/Cart/PaypalButton.tsx
import { useEffect, useRef, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface PayPalButtonProps {
  total: number;
  items: CartItem[];
  onSuccess: (paymentDetails: any) => void;
}

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PayPalButton({ total, items, onSuccess }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paypalRef.current || total <= 0) return;

    const loadPayPalScript = () => {
      const clientId = "AXt0v99cTerIqmECOrT_Rp15i5-uK8Fh4YLIriKTAWFSEGWFYrRTbX98fy-MxGhPq1fj8F1sfFEzBJ20";
      const scriptUrl = `https://sandbox.paypal.com/sdk/js?client-id=${clientId}&currency=MXN&enable-funding=card`;

      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (existingScript) {
        if (window.paypal) {
          renderButton();
        }
        return;
      }

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;

      script.onload = () => {
        console.log('PayPal cargado');
        renderButton();
      };

      script.onerror = () => {
        setError('No se pudo cargar PayPal');
      };

      document.body.appendChild(script);
    };

    const renderButton = () => {
      if (!window.paypal || !paypalRef.current) return;

      paypalRef.current.innerHTML = '';

      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 40
        },
        createOrder: function(data: any, actions: any) {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [{
              amount: {
                value: total.toFixed(2),
                currency_code: 'MXN'
              },
              description: `Compra de ${items.length} producto(s)`,
              custom_id: `ORDER-${Date.now()}`,
              invoice_id: `INV-${Date.now()}`
            }],
            application_context: {
              brand_name: 'HuertoSmart',
              landing_page: 'BILLING',
              user_action: 'PAY_NOW',
              shipping_preference: 'NO_SHIPPING'
            }
          });
        },
        onApprove: function(data: any, actions: any) {
          return actions.order.capture().then(function(details: any) {
            onSuccess({
              paymentId: data.orderID,
              payer: details.payer,
              total: total,
              items: items
            });
          });
        },
        onError: function(err: any) {
          console.error('Error PayPal:', err);
          setError('Hubo un error al procesar el pago. Por favor intenta de nuevo.');
        },
        onCancel: function(data: any) {
          console.log('Pago cancelado');
        }
      }).render(paypalRef.current);
    };

    loadPayPalScript();
  }, [total, items, onSuccess]);

  if (total <= 0) {
    return (
      <div className="paypal-container">
        <p>Agrega productos para pagar</p>
      </div>
    );
  }

  return (
    <div className="paypal-container">
      {error ? (
        <div style={{ textAlign: 'center' }}>
          <p className="paypal-error-message">❌ {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="paypal-reload-button"
          >
            Recargar página
          </button>
        </div>
      ) : (
        <>
          <div ref={paypalRef}></div>
          
          {/* Mensaje informativo con estilos de CSS */}
          <p className="paypal-test-message">
            🧪 Modo prueba - Usa:<br/>
            <strong>Email:</strong> sb-dy9pl49530664@business.example.com<br/>
            <strong>Contraseña:</strong> (la de tu cuenta sandbox)
          </p>
        </>
      )}
    </div>
  );
}