import React, { useEffect, useState } from "react";
import { variables } from "../lib/Variables";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    fetch(variables.API_URL + "/department")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
      });
  }, [departments]);

  const dataModal = (department) => {
    setDepartmentId(department.DepartmentId)
    setDepartmentName(department.DepartmentName);
    setEdit(true);
  };


  const addDepartment = async (departmentName) => {
    await fetch(variables.API_URL + "/department", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({departmentName}),
    })
      .then((res) => {
        res.json({ departmentName });
        setEdit(false);
        setDepartmentName("");
      })
      .catch((err) => console.log(err));
  };

  const editDepartment = async (departmentId , departmentName) => {
    await fetch(variables.API_URL + "/department", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ departmentId, departmentName }),
    })
      .then((res) => {
        res.json({ departmentName });
        setDepartmentName("");
        setEdit(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteDepartment = async (department) => {
    await fetch(variables.API_URL + "/department/" + department.DepartmentId, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    }).catch((err) => console.log(err));
  };

  return (
    <div>
      <button
        className="btn btn-primary float-end mt-3"
        data-bs-toggle="modal"
        data-bs-target="#modal"
        onClick={() => setEdit(false)}
      >
        Add Department
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Department Id</th>
            <th>Department Name</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department, index) => (
            <tr key={index}>
              <td>{department.DepartmentId}</td>
              <td>{department.DepartmentName}</td>
              <td>
                <button
                  className="btn btn-light mr-1"
                  onClick={() => dataModal(department)}
                  data-bs-toggle="modal"
                  data-bs-target="#modal"
                >
                  <IconEdit />
                  Edit
                </button>

                <button
                  className="btn btn-light mr-1"
                  onClick={() => deleteDepartment(department)}
                >
                  <IconDelete />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalDepartment
        departmentId={departmentId}
        departmentName={departmentName}
        setDepartmentName={setDepartmentName}
        editDepartment={editDepartment}
        edit={edit}
        setEdit={setEdit}
        addDepartment={addDepartment}
      />
    </div>
  );
};

export const ModalDepartment = ({
  departmentId,
  departmentName,
  addDepartment,
  editDepartment,
  setDepartmentName,
  edit,
  setEdit,
}) => {


  return (
    <div className="modal fade" id="modal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {edit ? `Edit Department: ${departmentName}` : "Add Department"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setEdit(false);
                setDepartmentName("")}}
            ></button>
          </div>
          <div className="modal-body">
            <div className="input-group mb-3">
              <span className="input-group-text">Department:</span>
              <input
                type="text"
                className="form-control"
                placeholder="Department Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => setDepartmentName("")}
            >
              Close
            </button>
            {edit ? (
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => editDepartment(departmentId, departmentName)}
              >
                Save changes
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => addDepartment(departmentName)}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const IconEdit = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fillRule="currentColor"
      className="bi bi-pencil-square"
      viewBox="0 0 16 16"
    >
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
      <path
        fillRule="evenodd"
        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
      />
    </svg>
  );
};

export const IconDelete = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-trash-fill"
      viewBox="0 0 16 16"
    >
      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
    </svg>
  );
};

export default Department;
