
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Job } from "../../entities/job.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import JobStatus from "../../enums/job-status.enum.js";

@Injectable()
export class CloseJobHandler {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) { }
  async handle(jobId: string): Promise<void> {
    const job = await this.jobRepository.findOneBy({ id: jobId });
    if (!job) {
      throw new NotFoundException("Job not found")
    }
    job.status = JobStatus.Closed;
    await this.jobRepository.save(job);
  }
}
