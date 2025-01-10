const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const app = require("./server"); // Import the Express app

describe("Todo API Test Cases", function () {
  this.timeout(5000);

  let validTodoId; // To store a valid ID for reuse in tests

  /**
   * Test case: Retrieving all todos
   * Purpose: Ensuring that GET /todos endpoint returns an array of all the available todos items.
   */
  it("should retrieve all todos", (done) => {
    chai
      .request(app)
      .get("/todos")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  /**
   * Test case: Adding a new todo in database
   * Purpose: Validating the POST /todos endpoint adds a todo and returns updated list back.
   */
  it("should add a new todo and return updated list", (done) => {
    chai
      .request(app)
      .post("/todos")
      .send({ task: "Test Task" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        validTodoId = res.body[res.body.length - 1]._id; // Assuming the last entry is the newly added todo
        done();
      });
  });

  /**
   * Test case: Updating a todo
   * Purpose: Ensuring PUT /todos modifies a specific todo by ID.
   */
  it("should update an existing todo and return updated list", (done) => {
    chai
      .request(app)
      .put("/todos")
      .send({ id: validTodoId, task: "Updated Test Task" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        const updatedTodo = res.body.find((todo) => todo._id === validTodoId);
        expect(updatedTodo).to.have.property("task", "Updated Test Task");
        done();
      });
  });

  /**
   * Test case: Deleting a todo from database
   * Purpose: Validating DELETE /todos/:id removes the specified todo.
   */
  it("should delete an existing todo and return updated list", (done) => {
    chai
      .request(app)
      .delete(`/todos/${validTodoId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        const deletedTodo = res.body.find((todo) => todo._id === validTodoId);
        expect(deletedTodo).to.be.undefined; // Verify the deleted todo is no longer in the list
        done();
      });
  });

  /**
   * Test case: Adding multiple todos in database.
   * Purpose: Ensuring bulk adding todos works and returns all added todos.
   */
  it("should add multiple todos and retrieve them", (done) => {
    const todos = [{ task: "Task 1" }, { task: "Task 2" }, { task: "Task 3" }];

    chai
      .request(app)
      .delete("/todos/clearAll") // Clear existing todos
      .end(() => {
        chai
          .request(app)
          .post("/todos/bulk")
          .send(todos)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array").with.lengthOf(todos.length);
            res.body.forEach((todo, index) => {
              expect(todo).to.have.property("task", todos[index].task);
            });
            done();
          });
      });
  });

  /**
   * Test case: Adding a todo with a special character in the task and submitting into database
   * Purpose: Validate that the API accepts and stores tasks with special characters.
   */
  it("should add a todo with special characters", (done) => {
    chai
      .request(app)
      .post("/todos")
      .send({ task: "Task with special characters: @#$%" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        const addedTodo = res.body.find(
          (todo) => todo.task === "Task with special characters: @#$%"
        );
        expect(addedTodo).to.exist;
        done();
      });
  });
  /**
   * Test case: Verifying endpoint handles duplicate tasks
   * Purpose: Ensure duplicate tasks can be added and retrieved correctly.
   */
  it("should allow duplicate tasks", (done) => {
    chai
      .request(app)
      .delete("/todos/clearAll") // Clear all existing todos
      .end(() => {
        chai
          .request(app)
          .post("/todos")
          .send({ task: "Duplicate Task" })
          .end(() => {
            chai
              .request(app)
              .post("/todos")
              .send({ task: "Duplicate Task" })
              .end((err, res) => {
                expect(res).to.have.status(200);
                const duplicateTasks = res.body.filter(
                  (todo) => todo.task === "Duplicate Task"
                );
                expect(duplicateTasks).to.have.lengthOf(2);
                done();
              });
          });
      });
  });

  /**
   * Test case: Retrieve a todo by ID
   * Purpose: Validate the GET /todos/:id endpoint returns the correct todo.
   */
  it("should retrieve a todo by ID", (done) => {
    chai
      .request(app)
      .post("/todos")
      .send({ task: "Retrieve by ID Test" })
      .end((err, res) => {
        const newTodoId = res.body[res.body.length - 1]._id;
        chai
          .request(app)
          .get(`/todos/${newTodoId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("_id", newTodoId);
            expect(res.body).to.have.property("task", "Retrieve by ID Test");
            done();
          });
      });
  });

  /**
   * Test case: Ensure todos can be updated multiple times
   * Purpose: Validate that a todo can be updated more than once.
   */
  it("should update a todo multiple times", (done) => {
    chai
      .request(app)
      .post("/todos")
      .send({ task: "Multiple Updates Test" })
      .end((err, res) => {
        const updateTodoId = res.body[res.body.length - 1]._id;
        chai
          .request(app)
          .put("/todos")
          .send({ id: updateTodoId, task: "First Update" })
          .end(() => {
            chai
              .request(app)
              .put("/todos")
              .send({ id: updateTodoId, task: "Second Update" })
              .end((err, res) => {
                expect(res).to.have.status(200);
                const updatedTodo = res.body.find(
                  (todo) => todo._id === updateTodoId
                );
                expect(updatedTodo).to.have.property("task", "Second Update");
                done();
              });
          });
      });
  });
});
