Cypress.Commands.add('signup', (name, password) => {
    cy.session(['SignUp', name], () => {
        cy.visit("/")
        cy.contains("Sign Up").click()
        cy.location('pathname').should('eq', '/signup')
        cy.get('input[id="username"]')
            .type(name)
        cy.get('input[id="password"]')
            .type(password)
        cy.get("button").contains("Sign Up").click()
        cy.location('pathname').should('eq', '/dashboard')
        cy.getCookie("jwt").its("value").should("not.be.empty")
    },
    {
        validate() {
          cy.visit('/dashboard')
        },
    },
    )
})

Cypress.Commands.add('login', (name, password) => {
    cy.session(['LogIn', name], () => {
        cy.visit("/")
        cy.get('input[id="username"]')
            .type(name)
        cy.get('input[id="password"]')
            .type(password)
        cy.get("button").contains("Log In").click()
        cy.location('pathname').should('eq', '/dashboard')
        cy.getCookie("jwt").its("value").should("not.be.empty")
    },
    {
        validate() {
          cy.visit('/dashboard')
        },
    },
    )
})