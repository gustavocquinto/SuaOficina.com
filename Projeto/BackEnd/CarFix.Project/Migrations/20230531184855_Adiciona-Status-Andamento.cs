using Microsoft.EntityFrameworkCore.Migrations;

namespace CarFix.Project.Migrations
{
    public partial class AdicionaStatusAndamento : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Vehicles",
                type: "int",
                maxLength: 20,
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Vehicles");
        }
    }
}
