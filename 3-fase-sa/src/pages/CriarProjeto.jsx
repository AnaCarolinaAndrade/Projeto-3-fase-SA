import './CriarProjeto.css';

export default function CriarProjeto() {
  return (
    <div className="application-main">
      <main>
        <div className="container">
          <h1 className="title">Criar um novo projeto</h1>
          <hr className="divider" />
          
          <form noValidate>
            <fieldset>
              <legend className="sr-only">Repository owner and name</legend>

              <div className="form-group">
                <label htmlFor="owner">Owner <span>*</span></label>
                <select id="owner" name="owner">
                  <option value="L7noxy">L7noxy</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="repo-name">Repository name <span>*</span></label>
                <input
                  type="text"
                  id="repo-name"
                  name="repo-name"
                  placeholder="e.g. my-project"
                  required
                />
              </div>

              <div className="form-suggestion">
                <p>Great repository names are short and memorable. Need inspiration?</p>
                <button type="button">automatic-eureka</button>
              </div>
            </fieldset>

            <div className="form-group">
              <label htmlFor="description">descrição <span>(optional)</span></label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="A short description of your project"
              />
            </div>

            <button type="submit" className="btn-primary">Create repository</button>
          </form>
        </div>
      </main>
    </div>
  );
}
