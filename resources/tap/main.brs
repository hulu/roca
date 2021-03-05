' Initializes a tap instance and prints out the plan.
function main(numSuites)
    tapInstance = tap()
    tapInstance.version()
    tapInstance.plan(numSuites)
    return tapInstance
end function
