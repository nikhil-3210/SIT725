const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

const app = require('./server'); 
describe('Todo API Tests', function () {
  this.timeout(5000);

  it('should retrieve all todos', (done) => {
    chai
      .request(app)
      .get('/todos')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should add a new todo and return updated list', (done) => {
    chai
      .request(app)
      .post('/todos')
      .send({ task: 'Test Task' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should not add a todo without a task', (done) => {
    chai
      .request(app)
      .post('/todos')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400); // Expect 400 for a bad request
        expect(res.body).to.have.property('error', 'Task is required and must be a string');
        done();
      });
  });

  it('should update an existing todo and return updated list', (done) => {
    const validTodoId = '67637d4aa8bd4a339ae44b9e';
    chai
      .request(app)
      .put('/todos')
      .send({ id: validTodoId, task: 'Updated Task' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return an error if the todo ID is invalid', (done) => {
    const invalidId = '123invalidid'; // Invalid ID format
    chai
      .request(app)
      .put('/todos')
      .send({ id: invalidId, task: 'Updated Task' })
      .end((err, res) => {
        expect(res).to.have.status(400); // Expect 400 for invalid ID
        expect(res.body).to.have.property('error', 'Invalid ID');
        done();
      });
  });

  it('should delete a todo and return updated list', (done) => {
    const validTodoId = '67637d4aa8bd4a339ae44b9e';
    chai
      .request(app)
      .delete(`/todos/${validTodoId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return an error if the todo ID is invalid', (done) => {
    const invalidId = '123invalidid'; // Invalid ID format
    chai
      .request(app)
      .delete(`/todos/${invalidId}`)
      .end((err, res) => {
        expect(res).to.have.status(400); // Expect 400 for invalid ID
        expect(res.body).to.have.property('error', 'Invalid ID');
        done();
      });
  });
});
