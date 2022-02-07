##
We can quickly observe, that for example, for the set $$C_1$$, we can consider each row independently. Hence if we figure out how to project onto the following sets $$S_n, H_n \in \reals^n$$ defined by

$$S_n = \{x \in \reals^n \mid \sum_{i=1}^n x_i = m\} \text{ and } H_n = \{x \in \reals^n \mid \sum_{i=1}^n x_i \leq m\}$$

then we can compute the projections for $$C_i$$ by repeatedly applying them for each row/column/diagonal.

In this case, we observe that $$S_n$$ and $$H_n$$ are actually hyperplanes/halfspaces respectively and obtain the formulas
