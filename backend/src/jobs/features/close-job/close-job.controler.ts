import { Controller, Param, Patch } from "@nestjs/common";
import { CloseJobHandler } from "./close-job.handler.js";

@Controller('jobs')
export class CloseJobController {
  constructor(private readonly closeJobHandler: CloseJobHandler) {}
  @Patch(':id/close')
  async closeJob(@Param('id') id: string) {
    await this.closeJobHandler.handle(id);
  }
}
