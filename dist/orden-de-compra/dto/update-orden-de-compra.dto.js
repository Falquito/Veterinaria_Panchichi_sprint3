"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrdenDeCompraDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_orden_de_compra_dto_1 = require("./create-orden-de-compra.dto");
class UpdateOrdenDeCompraDto extends (0, mapped_types_1.PartialType)(create_orden_de_compra_dto_1.CreateOrdenDeCompraDto) {
}
exports.UpdateOrdenDeCompraDto = UpdateOrdenDeCompraDto;
//# sourceMappingURL=update-orden-de-compra.dto.js.map