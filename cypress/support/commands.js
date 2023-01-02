Cypress.Commands.add('signup', (name, password) => {
    cy.visit("/")
    cy.contains("Sign Up").click()
    cy.location('pathname').should('eq', '/signup')
    cy.get('input[id="username"]')
        .type(name)
    cy.get('input[id="password"]')
        .type(password)
    cy.get("button").contains("Sign Up").click()
})

Cypress.Commands.add('login', (name, password) => {
    cy.visit("/")
    cy.get('input[id="username"]')
        .type(name)
    cy.get('input[id="password"]')
        .type(password)
    cy.get("button").contains("Log In").click()
})

Cypress.Commands.add('loginSession', (name, password) => {
    cy.session(['LogIn', name], () => {
        cy.login(name, password)
        cy.location('pathname').should('eq', '/dashboard')
        cy.getCookie("jwt").its("value").should("not.be.empty")
    },
    {
        validate() {
          cy.visit('/dashboard')
        },
    })
})