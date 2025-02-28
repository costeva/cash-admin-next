import User from "./Users";
import Expense from "./Expense";
import {
  Table,
  Column,
  DataType,
  HasMany,
  BelongsTo,
  AllowNull,
  ForeignKey,
  Model,
} from "sequelize-typescript";

@Table({
  tableName: "budgets",
})
class Budget extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;
  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  //declare es algo que esta en la ultima version de typescript y es para declarar variables que no se han inicializado aun pero que se van a inicializar en un futuro
  declare amount: number;

  @HasMany(() => Expense, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare expenses: Expense[];

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}

export default Budget;
