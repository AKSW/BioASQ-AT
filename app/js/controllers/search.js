angular.module('bioasq-at.controllers.search', ['bioasq-at.services.search'])
.controller('SearchCtrl', function ($scope, Questions, Search) {
    var itemsPerPage = 10;
    var pageSettings = {
        concepts:   { total: 0, current: 1 },
        documents:  { total: 0, current: 1 },
        statements: { total: 0, current: 1 },
        size:       itemsPerPage
    };
    var conceptSources = {
        'Disease Ontology': true,
        'Gene Ontology':    true,
        'Jochem':           true,
        'MeSH':             true,
        'UniProt':          true
    };

    $scope.question = Questions.selectedQuestion();

    $scope.$watch('pages.concepts.current', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            delete $scope.concepts;
            fetchConceptsIfNeeded($scope.terms, $scope.pages.concepts.current - 1, itemsPerPage);
        }
    });

    $scope.$watch('pages.documents.current', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            delete $scope.documents;
            fetchDocumentsIfNeeded($scope.terms, $scope.pages.documents.current - 1, itemsPerPage);
        }
    });

    function fetchConceptsIfNeeded(terms, page, itemsPerPage) {
        if (!$scope.concepts) {
            var sources = _.filter(_.keys(conceptSources), function (source) {
                return ($scope.pages.conceptSources[source] === true);
            });
            Search.concepts(terms, sources, true, page, itemsPerPage)
            .then(function (response) {
                $scope.pages.concepts.total = response.size;
                $scope.concepts = response.results.concepts;
                $scope.sources = response.sources;
                angular.forEach($scope.concepts, function (item) {
                    item.type = 'concept';
                });
            });
        }
    }

    function fetchDocumentsIfNeeded(terms, page, itemsPerPage) {
        if (!$scope.documents) {
            Search.documents(terms, page, itemsPerPage)
            .then(function (response) {
                $scope.pages.documents.total = response.size;
                $scope.documents = response.results.documents;
                angular.forEach($scope.documents, function (item) {
                    item.type = 'document';
                    item.abstract = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
                });
            });
        }
    }

    function fetchStatementsIfNeeded(terms, page, itemsPerPage) {
        if (!$scope.statements) {
            Search.statements(terms, page, itemsPerPage)
            .then(function (response) {
                $scope.pages.statements.total = response.size;
                $scope.statements = response.results.statements;
            });
        }
    }

    $scope.search = function () {
        $scope.pages          = _.extend({}, pageSettings);
        $scope.pages.conceptSources  = _.extend({}, conceptSources);
        $scope.groupByLabel   = true;

        delete $scope.concepts;
        fetchConceptsIfNeeded($scope.terms, $scope.pages.concepts.current - 1, itemsPerPage);

        delete $scope.documents;
        fetchDocumentsIfNeeded($scope.terms, $scope.pages.documents.current - 1, itemsPerPage);

        delete $scope.statements;
        fetchStatementsIfNeeded($scope.terms, $scope.pages.statements.current - 1, itemsPerPage);
    };

    $scope.toggleConceptSource = function (source) {
        $scope.pages.conceptSources[source] = !$scope.pages.conceptSources[source];

        var enabledSources = _.filter($scope.pages.conceptSources, function (enabled, source) {
            return (enabled && !!$scope.sources[source]);
        });

        if (enabledSources.length) {
            $scope.pages.concepts.current = 1;
            delete $scope.concepts;
            fetchConceptsIfNeeded($scope.terms, 0, itemsPerPage);
        } else {
            $scope.pages.conceptSources[source] = !$scope.pages.conceptSources[source];
        }
    };
});