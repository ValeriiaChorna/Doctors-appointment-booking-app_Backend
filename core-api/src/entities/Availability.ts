import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "./Doctor";

@Entity()
export class Availability extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: number;

  @Column()
  startTimeUtc: string;

  @Column()
  endTimeUtc: string;

  @ManyToOne(() => Doctor, doctor => doctor.availability)
  doctor: Doctor;
}