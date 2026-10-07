import { Injectable } from '@nestjs/common';

export interface TerminosResponseDto {
  version: string;
  titulo: string;
  contenido: string;
  fecha_vigencia: string;
}

@Injectable()
export class TerminosService {
  async obtenerTerminosActuales(): Promise<TerminosResponseDto> {
    return {
      version: '1.0.0',
      titulo: 'Términos y Condiciones del Programa de Puntos',
      contenido: `TÉRMINOS Y CONDICIONES DEL PROGRAMA DE PUNTOS CAMPER

Vigencia: 1 de Enero de 2026

1. OBJETIVO DEL PROGRAMA
El Programa de Puntos Camper es un programa de fidelización que permite a los clientes acumular puntos por cada compra de calzado realizada en tiendas Camper o a través de canales autorizados.

2. ACUMULACIÓN DE PUNTOS
2.1. Por cada compra elegible, el cliente acumulará puntos según la regla de acumulación vigente al momento de la compra.
2.2. Los puntos se calcularán basándose en el monto total de la compra en pesos colombianos (COP).
2.3. Los puntos acumulados tendrán el estatus de "pendientes" durante los primeros 7 días y luego pasarán a "disponibles" para su canje.
2.4. Una regla de acumulación aplicará por línea de compra.

3. VIGENCIA DE LOS PUNTOS
3.1. Los puntos vencen 365 días después de la fecha de acumulación.
3.2. Los puntos próximos a vencer se consumirán primero en caso de un canje.
3.3. Los puntos vencidos no podrán ser reactivados bajo ninguna circunstancia.

4. CANJE DE PUNTOS
4.1. Los puntos pueden ser canjeados por descuentos durante el proceso de pago.
4.2. El valor de conversión será de 1 punto = 1 COP.
4.3. Los puntos solo pueden ser canjeados por el titular de la cuenta.
4.4. No se permite el canje de puntos que se encuentren en estado pendiente.

5. DEVOLUCIONES
5.1. En caso de devolución de una compra, los puntos acumulados por dicha compra serán revertidos.
5.2. Si el cliente ha utilizado puntos antes de la devolución, el sistema ajustará el saldo según la regla de negocio vigente.
5.3. La reversión de puntos se realizará según la regla original de acumulación.

6. AJUSTES MANUALES
6.1. Solo los administradores autorizados pueden realizar ajustes manuales de puntos.
6.2. Los ajustes manuales requieren aprobación de un segundo administrador.
6.3. Todo ajuste quedara registrado en el historial de auditoría.

7. SEGURIDAD Y PRIVACIDAD
7.1. Los datos personales de los clientes están protegidos conforme a la política de privacidad.
7.2. Los datos de puntos y movimientos están cifrados en tránsito y en reposo.
7.3. El acceso a la información está restringido por roles y permisos.

8. LIMITACIONES
8.1. El programa está disponible únicamente en Colombia.
8.2. El programa es válido exclusivamente para compras de calzado Camper.
8.3. No se permiten transferencias de puntos entre cuentas.
8.4. Los puntos no tienen valor monetary fuera del programa.

9. MODIFICACIONES
9.1. Camper se reserva el derecho de modificar los términos y condiciones del programa.
9.2. Cualquier modificación será comunicada a los clientes con anticipación.
9.3. La versión vigente de los términos estará disponible en el portal del cliente.

10. CONTACTO
Para cualquier consulta sobre el programa de puntos, contacte a través de los canales de atención al cliente autorizados.`,
      fecha_vigencia: '2026-01-01',
    };
  }
}
