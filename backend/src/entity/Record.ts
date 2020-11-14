import { Field, ObjectType } from "type-graphql";
import {
  ChildEntity,
  CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn
} from "typeorm";


export enum RecordType {
  /** 设置余额 */ SET_BALANCE = 1,
  /** 收入 */ INCOME = 2,
  /** 支出 */ EXPENSE = 3,
  /** 转入 */ TRANSFER_IN = 4,
  /** 转出 */ TRANSFER_OUT = 5
}


@ObjectType()
@Entity()
@TableInheritance()
export class Record {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  recordId!: string

  @Field({ defaultValue: "" })
  remark!: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}

@ObjectType()
@ChildEntity()
export class SetBalanceRecord extends Record {

}

@ObjectType()
@ChildEntity()
export class IncomeRecored extends Record {

}

@ObjectType()
@ChildEntity()
export class ExpenseRecord extends Record {

}

@ObjectType()
@ChildEntity()
export class TransferInRecord extends Record {

}

@ObjectType()
@ChildEntity()
export class TransferOutRecord extends Record {

}
