/// <reference types="cypress" />
Cypress.session.clearAllSavedSessions()
const user = "testuser"
const password = "testuserpassword567"

describe("signup", () => {
    it("signup", () => {
        Cypress.Cookies.debug(true, {verbose:true})
        cy.clearCookies()
        cy.signup(user, password)
        cy.visit("/")
        cy.url().should('contain', '/dashboard')
        cy.contains(`Hi ${user}`).should("be.visible")
    })
})

describe("actions", () => {
    beforeEach(() => {
        Cypress.Cookies.debug(true, {verbose:true})
        cy.login(user, password)
        cy.visit("/dashboard")
    })

    it("should be able to log in, reload the page and still be logged in", () => {
        cy.contains(`Hi ${user}`).should("be.visible")
        cy.reload()
        cy.contains(`Hi ${user}`).should("be.visible")
        cy.getCookie("jwt").its("value").should("not.be.empty")
    })
        
    it("can post, edit and delete a comment", () => {
        //post comment
        const comment = "test comment"
        cy.get('textarea[name="userComment"]')
          .type(comment)
        cy.get("button").contains("Post").click()

        cy.get(".comment")
          .should("contain", user)
          .as("comment")
          .should("contain", comment)

        //edit comment
        cy.get(".change-comment").contains("edit").click()
        cy.get(".comment-input").as("comment-text")
          .type("{selectAll}{del}new comment")
        cy.get(".change-comment").contains("Cancel").click()
        cy.get("@comment-text").should("have.text", comment)

        cy.get(".change-comment").contains("edit").click()
        cy.get(".comment-input").as("comment-text")
          .type("{selectAll}{del}new comment")
        cy.get(".change-comment").contains("Accept").click()
        cy.get("@comment-text").should("have.text", "new comment")

        //delete comment
        cy.get(".change-comment").contains("delete").click()
        cy.get("@comment").should("not.exist")
    })

    it("should be able to log out", () => {
        cy.get(".dash-options").contains("logout").click()
        cy.get("h1").contains("Log In")
        cy.location('pathname').should('eq', '/')
        cy.getCookie("jwt").its("value").should("be.empty")
    })

})

describe("delete accout", () => {
    beforeEach(() => {
        Cypress.session.clearAllSavedSessions()
        Cypress.Cookies.debug(true, {verbose:true})
        cy.login(user, password)
        cy.visit("/dashboard")
      })

    it("can delete it's account", () => {
        cy.get(".dash-options").contains("delete account").click()
        cy.get(".delete-confirm").contains("yes").click()
        cy.location('pathname').should('eq', '/')
        cy.getCookie("jwt").should("not.exist")
    })
})
    
