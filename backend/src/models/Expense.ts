import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";
import Budget from "./Budget";

@Table({
  tableName: "expenses",
})
class Expense extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;
  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  declare amount: number;

  // Declaramos la propiedad budgetId como una clave foránea que referencia al modelo Budget
  @ForeignKey(() => Budget)
  declare budgetId: number;

  // Establecemos una relación de pertenencia entre el modelo actual y el modelo Budget
  @BelongsTo(() => Budget)
  declare budget: Budget;
}

export default Expense;
