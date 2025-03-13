import Budget from "./Budget";
import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  AllowNull,
  Default,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";

@Table({ tableName: "users" })
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING(50))
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING(60))
  declare password: string;

  // Valor por defecto para evitar error de validación si no se envía token
  @AllowNull(false)
  @Default("default-token")
  @Column(DataType.STRING)
  declare token: string;

  // Ajustar a boolean
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare confirmed: boolean;

  @HasMany(() => Budget, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare budgets: Budget[];
}

export default User;
