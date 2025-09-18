"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDepositoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_deposito_dto_1 = require("./create-deposito.dto");
class UpdateDepositoDto extends (0, mapped_types_1.PartialType)(create_deposito_dto_1.CreateDepositoDto) {
}
exports.UpdateDepositoDto = UpdateDepositoDto;
//# sourceMappingURL=update-deposito.dto.js.map