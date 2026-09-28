import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "../../entities/job.entity.js";
import { In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { JobCreationDto } from "./create-job.dto.js";
import { Tag } from "../../../tags/entities/tag.entity.js";



@Injectable()
export class CreateJobHandler {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  async handle(dto: JobCreationDto): Promise<Job> {
    const tags = await this.tagRepository.find( {where: {name: In(dto.tags)}})
    const job = this.jobRepository.create({ ...dto, tags })
    return this.jobRepository.save(job)
  }
}
