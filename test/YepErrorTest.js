import Enum from "enumit";
import YepError from "../lib/YepError";

describe("YepError", function () {
    var { UNKNOWN } = YepError.Errors;

    it("exposes an UNKNOWN error codes", () => {
        YepError.Errors.should.ownProperty("UNKNOWN");
    });

    it("belongs to a group code", () => {
        YepError.groupCode.should.equal(100);
    });

    describe("when creating an YepError w/o parameters", () => {
        beforeEach(() => {
            this.error = new YepError();
        });

        it("should have the title `YepError`", () => {
            this.error.title.should.equal("YepError");
        });

        it("should have the name `YepError#UNKNOWN`", () => {
            this.error.name.should.equal("YepError#UNKNOWN");
        });

        it("should be an UNKNOWN YepError", () => {
            this.error.code.should.eql(UNKNOWN);
        });

        it("should have a message the same as the name`", () => {
            this.error.message.should.equal(this.error.name);
        });

        it("should have empty details", () => {
            this.error.details.should.eql({});
        });

        it("should output to the proper string representation", () => {
            String(this.error).should.equal("Error 101");
        })

        it("should be an `YepError`", () => {
            YepError.isYepError(this.error).should.be.true;
        });
    });

    describe("when creating an YepError w/ a key", () => {
        beforeEach(() => {
            this.error = new YepError("UNKNOWN");
        });

        it("should be an UNKNOWN error", () => {
            this.error.code.should.eql(UNKNOWN);
        });

        it("should have a message the same as the key`", () => {
            this.error.message.should.equal(this.error.name);
        });

        it("should have empty details", () => {
            this.error.details.should.eql({});
        });

        it("should be a YepError", () => {
            YepError.isYepError(this.error, "UNKNOWN").should.be.true;
        });
    });

    describe("when providing a opts", () => {
        beforeEach(() => {
            var details = { isFoo: true };
            var message = "Oops. My bad :(";

            this.error = new YepError("UNKNOWN", { details, message });
            this.errorInfo = { details, message };
        });

        it("should be an UNKNOWN error", () => {
            this.error.code.should.eql(UNKNOWN);
        });

        it("should have the correct message`", () => {
            this.error.message.should.to.have.string(this.errorInfo.message);
        });

        it("should have the correct details", () => {
            this.error.details.should.eql(this.errorInfo.details);
        });

        it("should be a YepError", () => {
            YepError.isYepError(this.error, "UNKNOWN").should.be.true;
        });
    });

    describe("when extending YepError", () => {
        beforeEach(() => {
            var Errors = new Enum("UNKNOWN", "DOH");

            class CustomError extends YepError {
                get title() { return "CustomError"; }
                static get groupCode() { return 5000; }
                static get Errors() { return Errors; }
                static isCustomError(err, key) {
                    return YepError.isYepError(err, key, CustomError);
                }
            }

            this.CustomError = CustomError;

            this.error = new CustomError("DOH");
        });

        it("should have the name `CustomError#DOH`", () => {
            this.error.name.should.equal("CustomError#DOH");
        });

        it("should be a DOH CustomError", () => {
            this.error.code.should.equal(this.CustomError.Errors.DOH);
        });

        it("should have a message the same as the name`", () => {
            this.error.message.should.equal(this.error.name);
        });

        it("should have empty details", () => {
            this.error.details.should.eql({});
        });

        it("should output to the proper string representation", () => {
            String(this.error).should.equal("Error 5002");
        })

        it("should be a `CustomError`", () => {
            this.CustomError.isCustomError(this.error).should.be.true;
        });
    });
});
