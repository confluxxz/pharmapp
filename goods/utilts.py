from pharmapp.goods.models import Items
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, SearchHeadline

def query_search(query):

    if query.isdigit() and len(query) <= 4:
        return Items.objects.filter(id=int(query))
    vector = SearchVector("name", "description")
    query = SearchQuery(query)

    result = (
        Items.objects.annotate(rank=SearchRank(vector, query))
        .filter(rank__gt=0)
        .order_by("-rank")
    )

    result = result.annotate(
        headline=SearchHeadline(
            "name",
            query,
            start_sel='<span style="background-color: rgb(205, 150, 90);">',
            stop_sel='</span>',
        )
    )

    result = result.annotate(
        bodyline=SearchHeadline(
            "description",
            query,
            start_sel='<span style="background-color: rgb(205, 150, 90);">',
            stop_sel='</span>',
        )
    )

    return result


    # keywords = [word for word in query.split() if len(word) > 2]
    #
    # query_objects = Q()
    #
    # for token in keywords:
    #     query_objects |= Q(description__icontains=token)
    #     query_objects |= Q(name__icontains=token)
    #
    # return Items.objects.filter(query_objects)