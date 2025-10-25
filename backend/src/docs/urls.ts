/**
 * @openapi
 * /api/urls:
 *   post:
 *     summary: Crea una URL corta
 *     tags:
 *       - URLs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateUrlBody"
 *     responses:
 *       '201':
 *         description: URL creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiResponse"
 *               properties:
 *                 data:
 *                   $ref: "#/components/schemas/UrlModel"
 *       '400':
 *         description: Solicitud inválida
 *       '500':
 *         description: Error interno
 */

/**
 * @openapi
 * /api/urls/{shortId}:
 *   get:
 *     summary: Redirige a la URL original
 *     tags:
 *       - URLs
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID corto de la URL
 *     responses:
 *       '302':
 *         description: Redirección a la URL original
 *       '404':
 *         description: URL no encontrada
 *       '500':
 *         description: Error interno
 */
