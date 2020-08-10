workspace "Course Search" "A system to search for courses available at the University of York" {

    model {
        prospectiveStudent = person "Prospective Student" "A prospective student, searching for one or more courses"

        courseSearch = softwareSystem "Course Search System" "Allows anyone to search for details of courses available at the University of York" {
            webApplication = container "Web Application" "Provides functionality for users to search for courses in their web browser" "React on AWS S3" "Web Browser"
            apiApplication = container "API" "Provides course search functionality via a JSON/HTTPS API" "AWS API Gateway and AWS Lambda"
        }

        # external software systems
        searchProvider = softwareSystem "Funnelback Search Provider System" "The system that powers searches on YorkWeb" "Existing System"
        cms = softwareSystem "Content Management System" "The system that provides the content for YorkWeb" "Existing System"

        # system context relationships
        prospectiveStudent -> courseSearch "Searches for courses using"
        courseSearch -> searchProvider "Queries"
        courseSearch -> cms "Links to pages in"
        searchProvider -> cms "Indexes pages in"

        # container relationships
        prospectiveStudent -> webApplication "Searches for courses using" "HTTPS"
        webApplication -> apiApplication "Makes API calls to" "JSON/HTTPS"
        webApplication -> cms "Links to pages in"
        apiApplication -> searchProvider "Makes API calls to" "JSON/HTTPS"
    }

    views {
        systemContext courseSearch "SystemContext" {
            include *
            autoLayout
        }

        container courseSearch "Containers" {
            include *
            autoLayout
        }

        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }

            element "Existing System" {
                background #999999
                color #ffffff
            }

            element "Person" {
                shape roundedBox
                background #08427b
                color #ffffff
            }

            element "Container" {
                background #438dd5
                color #ffffff
            }

            element "Web Browser" {
                shape WebBrowser
            }
        }
    }
}
