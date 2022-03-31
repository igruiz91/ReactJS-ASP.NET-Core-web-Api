using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server_api.Models;
using System.Data;
using System.Data.SqlClient;

namespace server_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private string sqlDataSource;
        private DataTable table;
        private SqlConnection sqlConnection;
        
        public EmployeeController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
            sqlDataSource = _configuration.GetConnectionString("EmployeeAppCon");
            table = new DataTable();
            sqlConnection = new SqlConnection(sqlDataSource);
        }


        [HttpGet]
        public JsonResult Get()
        {
            string query = @"select EmployeeId, EmployeeName, Department,
                                convert(varchar(10), DateOfJoining,120) as DateOfJoining, PhotoFileName
                            from dbo.Employee
                            order by EmployeeId";

            DataTable table = new DataTable();
            string sqlDataSource = this.sqlDataSource;
            SqlDataReader myReader;
            SqlConnection myConnection = new SqlConnection(sqlDataSource);
            myConnection.Open();
            SqlCommand sqlCommand = new SqlCommand(query, myConnection);
            myReader = sqlCommand.ExecuteReader();
            table.Load(myReader);
            myReader.Close();
            myConnection.Close();

            return new JsonResult(table);
        }

        
        [HttpGet("{id}")]
        public JsonResult GetUser(int id)
        {
            string query = @"select EmployeeId,EmployeeName,
                                    Department,convert(varchar(10), DateOfJoining,120) 
                                 as DateOfJoining,PhotoFileName 
                            from dbo.Employee 
                            where EmployeeId = @EmployeeId";
            SqlDataReader myReader;
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand(query,sqlConnection);
            sqlCommand.Parameters.AddWithValue("@EmployeeId", id);
            myReader=sqlCommand.ExecuteReader();
            table.Load(myReader);
            myReader.Close();
            sqlConnection.Close();

            return new JsonResult(table);
        }

        [HttpPost]
        public JsonResult Post(Employee employee)
        {
            string query = @"insert into dbo.Employee 
                                (EmployeeName,Department,DateOfJoining,PhotoFileName) 
                            values(@EmployeeName, @Department, @DateOfJoining, @PhotoFileName)";

            DataTable table = new DataTable();
            string sqlDataSource = this.sqlDataSource;
            SqlConnection sqlConnection = new SqlConnection(sqlDataSource);
            sqlConnection.Open();
            SqlCommand myCommand = new SqlCommand(query, sqlConnection);
            myCommand.Parameters.AddWithValue("@EmployeeName", employee.EmployeeName);
            myCommand.Parameters.AddWithValue("@Department", employee.Department);
            myCommand.Parameters.AddWithValue("@DateOfJoining", employee.DateOfJoining);
            myCommand.Parameters.AddWithValue("@PhotoFileName", employee.PhotoFileName);
            SqlDataReader sqlDataReader = myCommand.ExecuteReader();
            table.Load(sqlDataReader);
            sqlDataReader.Close();
            sqlConnection.Close();

            return new JsonResult("Added Successfully");
        }

        [HttpPut]
        public JsonResult Put(Employee employee)
        {
            string query = @"update dbo.Employee set 
                                EmployeeName = @EmployeeName,
                                Department = @Department,
                                DateOfJoining = @DateOfJoining,
                                PhotoFileName = @PhotoFileName
                            where EmployeeId= @EmployeeId
            ";
            DataTable table = new DataTable();
            string dataSource = this.sqlDataSource;
            SqlConnection myConnection = new SqlConnection(dataSource);
            myConnection.Open();
            SqlCommand myCommand = new SqlCommand(query, myConnection);
            myCommand.Parameters.AddWithValue("@EmployeeName", employee.EmployeeName);
            myCommand.Parameters.AddWithValue("@Department", employee.Department);
            myCommand.Parameters.AddWithValue("@DateOfJoining", employee.DateOfJoining);
            myCommand.Parameters.AddWithValue("@PhotoFileName", employee.PhotoFileName);
            myCommand.Parameters.AddWithValue("@EmployeeId", employee.EmployeeId);
            SqlDataReader sqlDataReader = myCommand.ExecuteReader();
            table.Load(sqlDataReader);
            sqlDataReader.Close();
            myConnection.Close();

            return new JsonResult("Updated Successfully");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"delete from dbo.Employee where EmployeeId = @EmployeeId";
            
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand(query, sqlConnection);
            sqlCommand.Parameters.AddWithValue("@EmployeeId", id);
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
            table.Load(sqlDataReader);
            
            sqlDataReader.Close();
            sqlConnection.Close();

            return new JsonResult("Employee deleted successfully");
        }

        [Route("SaveFile")]
        [HttpPost]
        public JsonResult SaveFile()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;
                var physicalPath = _env.ContentRootPath + "/Photos/" + filename;
                using(var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }
                return new JsonResult(filename);
            }
            catch (Exception ex)
            {
                return new JsonResult("anonymous.png");
            }
        }
    }
}
