import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Doctor } from "./Doctor";

@ObjectType()
@Entity()
export class Availability extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  dayOfWeek: number;

  @Field()
  @Column()
  startTimeUtc: string;

  @Field()
  @Column()
  endTimeUtc: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.availability)
  doctor: Doctor;
}
