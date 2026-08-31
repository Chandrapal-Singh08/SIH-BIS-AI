from sentence_transformers import SentenceTransformer

# Load model only once
model = SentenceTransformer("all-MiniLM-L6-v2")


def create_embedding(text: str):
    """
    Convert text into a 384-dimensional embedding vector.
    """
    embedding = model.encode(text)

    return embedding


if __name__ == "__main__":

    sample = """
    LED Luminaire for Road and Street Lighting
    IP66 Protection
    36W LED
    """

    vector = create_embedding(sample)

    print("Embedding Dimension:", len(vector))
    print(vector[:10])