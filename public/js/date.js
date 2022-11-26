var date = date || {};

date.year = () => {

    const d = new Date(),
          f = d.getFullYear(),
          y = document.getElementsByClassName("year");

    for(let i=0; i < y.length; i++)
    {
	    y[i].innerHTML = f;
    }

    return f;
};

export { date }