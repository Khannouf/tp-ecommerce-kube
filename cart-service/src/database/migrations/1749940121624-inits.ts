import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Init1749808207182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cart",
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    { name: 'userId', type: 'int', isNullable: false },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            })
        )
        await queryRunner.createTable(new Table({
            name: "cart_product",
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                { name: 'cartId', type: 'int', isNullable: false },
                { name: 'productId', type: 'int', isNullable: false },
                { name: 'quantity', type: 'int', default: 1 },
            ],
            foreignKeys: [
                {
                    columnNames: ['cartId'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'cart',
                    onDelete: 'CASCADE',
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cart_product");
        await queryRunner.dropTable("cart");
    }

}
